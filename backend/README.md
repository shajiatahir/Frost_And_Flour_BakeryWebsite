# Bakery Backend

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure MySQL Database:**
   - Create a database named `bakery` in MySQL Workbench.
   - Run the complete schema from `models/schema.sql` to create all tables and sample data.
   - The schema includes:
     - Users table with role-based authentication
     - Menu items table
     - Orders table
     - Contact messages table
     - Sample admin and customer users

3. **Environment Configuration:**
   - Copy `.env.example` to `.env` and fill in your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=bakery
   PORT=3001
   ```

4. **Run the backend server:**
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001

## User Management System

### User Roles

**Customer (Default):**
- Can register through signup form
- Access: Home, Menu, About, Track Orders, Contact, Cart, Checkout
- Cannot access admin routes

**Admin:**
- Must be manually created (cannot register through signup)
- Access: All customer features + Admin Dashboard
- Can manage orders, contact messages, and users

### Creating Admin Users

**Method 1: Using the utility script**
```bash
node createAdmin.js admin@example.com password123 "Admin Name"
```

**Method 2: Manual database insertion**
```sql
INSERT INTO users (email, password, name, role) 
VALUES ('admin@example.com', 'hashedpassword', 'Admin Name', 'admin');
```

**Method 3: Using Admin Dashboard**
- Login as existing admin
- Go to Admin Dashboard → Users tab
- Change user role from 'customer' to 'admin'

### Sample Users

**Admin User:**
- Email: `admin@bakery.com`
- Password: `admin123`

**Customer User:**
- Email: `customer@example.com`
- Password: `customer123`

## API Endpoints

### Authentication
- `POST /api/signup` — Register a new customer (role automatically set to 'customer')
- `POST /api/login` — Login with email and password

### Customer Endpoints
- `GET /api/menu` — Get all menu items
- `GET /api/orders/customer/:email` — Get orders for specific customer
- `POST /api/orders` — Create new order (from checkout)
- `POST /api/contact` — Send contact message

### Admin Endpoints (Require admin authentication)
- `GET /api/orders` — Get all orders
- `PUT /api/orders/:id` — Update order
- `DELETE /api/orders/:id` — Delete order
- `POST /api/admin/orders` — Create order from admin panel
- `GET /api/contact` — Get all contact messages
- `DELETE /api/contact/:id` — Delete contact message
- `POST /api/admin/send-email` — Send email reply to customer
- `GET /api/admin/users` — Get all users
- `PUT /api/admin/users/:id/role` — Update user role
- `DELETE /api/admin/users/:id` — Delete user

## Security Features

- **Role-based Access Control:** Customers cannot access admin routes
- **Password Hashing:** All passwords are hashed using bcrypt
- **Input Validation:** Email format and password strength validation
- **Admin-only Registration:** Only customers can register through signup
- **Authentication Headers:** Admin endpoints require proper authentication

## Frontend Integration

The frontend automatically handles:
- Role-based navigation (different menu items for different roles)
- Route protection (unauthorized users redirected)
- Role-based redirects after login (admins → admin dashboard, customers → home)
- Authentication headers for admin API calls 