const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!', timestamp: new Date().toISOString() })
})

// Debug endpoint to check all orders
app.get('/api/debug/orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, total, date FROM orders ORDER BY date DESC')
    res.json({ 
      message: 'All orders in database', 
      count: rows.length, 
      orders: rows 
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Debug endpoint to check raw order data including items
app.get('/api/debug/orders/raw', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY date DESC')
    res.json({ 
      message: 'Raw orders data from database', 
      count: rows.length, 
      orders: rows 
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Utility endpoint to fix malformed items data
app.post('/api/debug/fix-items', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE items = "[object Object]" OR items = "[]" OR items IS NULL')
    console.log('Found orders with malformed items:', rows.length)
    
    for (const order of rows) {
      // Set items to empty array for malformed data
      await pool.query('UPDATE orders SET items = ? WHERE id = ?', ['[]', order.id])
      console.log('Fixed order ID:', order.id)
    }
    
    res.json({ 
      message: 'Fixed malformed items data', 
      fixedCount: rows.length 
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    // In a real application, you would verify JWT tokens here
    // For now, we'll check if the request has admin headers
    const userEmail = req.headers['x-user-email']
    const userRole = req.headers['x-user-role']
    
    if (!userEmail || userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    
    // Verify user exists and is admin
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [userEmail, 'admin'])
    if (users.length === 0) {
      return res.status(403).json({ message: 'Admin access required' })
    }
    
    next()
  } catch (err) {
    res.status(500).json({ message: 'Authentication error' })
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bakery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Menu endpoints
app.get('/api/menu', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu_items')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Customer-specific endpoints (must come before generic orders routes)
app.get('/api/orders/customer/:email', async (req, res) => {
  console.log('Customer orders request received for email:', req.params.email)
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE email = ? ORDER BY date DESC', [req.params.email])
    console.log('Found orders:', rows.length)
    for (const order of rows) {
      console.log('Processing order:', order.id, 'Raw items:', order.items, 'Type:', typeof order.items)
      if (!order.items) {
        order.items = []
        console.log('No items found, setting to empty array')
        continue
      }
      
      // Handle different types of items data
      if (typeof order.items === 'string') {
        try {
          // Check if it's already a valid JSON string
          if (order.items.startsWith('[') || order.items.startsWith('{')) {
            order.items = JSON.parse(order.items)
          } else if (order.items === '[object Object]' || order.items === '[]') {
            // Handle cases where items might be empty or malformed
            order.items = []
            console.log('Items was [object Object] or empty, setting to empty array')
          } else {
            console.log('Unknown items format:', order.items)
            order.items = []
          }
        } catch (e) {
          console.error('Failed to parse order.items for order id', order.id, e, 'Raw value:', order.items)
          order.items = []
        }
      } else if (Array.isArray(order.items)) {
        // Items is already an array
        console.log('Items is already an array:', order.items)
      } else {
        // Items is some other type, set to empty array
        console.log('Items is not string or array, setting to empty array. Type:', typeof order.items)
        order.items = []
      }
      
      // Ensure items is an array
      if (!Array.isArray(order.items)) {
        order.items = []
        console.log('Items is not an array after processing, setting to empty array')
      } else {
        console.log('Successfully processed items:', order.items)
      }
    }
    res.json(rows)
  } catch (err) {
    console.error('Error in GET /api/orders/customer/:email:', err)
    res.status(500).json({ error: err.message })
  }
})

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY date DESC')
    for (const order of rows) {
      if (!order.items) {
        order.items = []
        continue
      }
      try {
        order.items = JSON.parse(order.items)
        if (!Array.isArray(order.items)) order.items = []
      } catch (e) {
        order.items = []
        console.error('Failed to parse order.items for order id', order.id, e, 'Raw value:', order.items)
      }
    }
    res.json(rows)
  } catch (err) {
    console.error('Error in GET /api/orders:', err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, contact, address, items, total } = req.body
    const itemsStr = JSON.stringify(items)
    const [result] = await pool.query(
      'INSERT INTO orders (name, email, contact, address, items, total, date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email, contact, address, itemsStr, total]
    )
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId])
    const order = orderRows[0]
    order.items = JSON.parse(order.items)
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { name, email, contact, address, items, total } = req.body
    if (!name || !email || !contact || !address || !items || typeof total === 'undefined') {
      return res.status(400).json({ error: 'Missing required order fields.' })
    }
    let itemsStr
    try {
      itemsStr = JSON.stringify(items)
    } catch (e) {
      return res.status(400).json({ error: 'Invalid items format.' })
    }
    await pool.query(
      'UPDATE orders SET name=?, email=?, contact=?, address=?, items=?, total=? WHERE id=?',
      [name, email, contact, address, itemsStr, total, req.params.id]
    )
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id])
    const order = orderRows[0]
    order.items = JSON.parse(order.items)
    res.json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Contact form endpoints
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body
    await pool.query(
      'INSERT INTO contact_messages (name, email, message, date) VALUES (?, ?, ?, NOW())',
      [name, email, message]
    )
    res.status(201).json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get('/api/contact', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY date DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/contact/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Admin-specific endpoints
app.get('/api/admin/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/orders', async (req, res) => {
  try {
    const { name, email, contact, address, items, total } = req.body
    const itemsStr = JSON.stringify(items)
    const [result] = await pool.query(
      'INSERT INTO orders (name, email, contact, address, items, total, date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email, contact, address, itemsStr, total]
    )
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId])
    const order = orderRows[0]
    order.items = JSON.parse(order.items)
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/admin/send-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body
    
    // Log the email details for now
    console.log('📧 Email to be sent:', {
      to,
      subject,
      message,
      timestamp: new Date().toISOString()
    })
    
    // In a production environment, you would integrate with:
    // - SendGrid: https://sendgrid.com/
    // - AWS SES: https://aws.amazon.com/ses/
    // - Nodemailer with Gmail/SMTP
    // - Mailgun: https://www.mailgun.com/
    
    // Example with Nodemailer (uncomment and configure):
    /*
    const nodemailer = require('nodemailer')
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: message,
      html: message.replace(/\n/g, '<br>')
    }
    
    await transporter.sendMail(mailOptions)
    */
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully! (Check console for details)',
      emailDetails: { to, subject, message }
    })
  } catch (err) {
    console.error('Error sending email:', err)
    res.status(500).json({ error: err.message })
  }
})

// User management endpoints
app.put('/api/admin/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be customer or admin.' })
    }
    
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id])
    res.json({ success: true, message: 'User role updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id])
    res.json({ success: true, message: 'User deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Authentication endpoints
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body)
    const { email, password, name, role } = req.body
    
    console.log('Extracted data:', { email, password: password ? '[HIDDEN]' : 'undefined', name, role })
    
    if (!email || !password || !name) {
      console.log('Validation failed - missing fields:', { email: !!email, password: !!password, name: !!name })
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' })
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Only allow customer role registration through signup
    // Admins must be manually added to database
    const userRole = role === 'admin' ? 'customer' : 'customer'

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user (always as customer)
    await pool.query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', 
      [email, hashedPassword, name, userRole])
    
    console.log('User created successfully:', { email, name, role: userRole })
    res.status(201).json({ success: true, message: 'Customer account created successfully' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = users[0]

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at
    }

    res.json({ success: true, user: userData })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) 