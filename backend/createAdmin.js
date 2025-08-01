const bcrypt = require('bcryptjs')
const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bakery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function createAdminUser(email, password, name) {
  try {
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (existingUsers.length > 0) {
      console.log('User already exists. Updating role to admin...')
      await pool.query('UPDATE users SET role = ? WHERE email = ?', ['admin', email])
      console.log(`User ${email} is now an admin`)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Insert new admin user
    await pool.query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', 
      [email, hashedPassword, name, 'admin'])
    
    console.log(`Admin user ${email} created successfully`)
  } catch (err) {
    console.error('Error creating admin user:', err)
  } finally {
    await pool.end()
  }
}

// Get command line arguments
const args = process.argv.slice(2)
if (args.length >= 3) {
  const [email, password, name] = args
  createAdminUser(email, password, name)
} else {
  console.log('Usage: node createAdmin.js <email> <password> <name>')
  console.log('Example: node createAdmin.js admin@bakery.com password123 "Admin Name"')
} 