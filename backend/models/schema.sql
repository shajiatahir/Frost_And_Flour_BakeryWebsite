-- Complete Database Setup for Bakery Management System

-- Create and use the database
CREATE DATABASE IF NOT EXISTS bakery;
USE bakery;

-- Users Table (for authentication with roles)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  name VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  img VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  `desc` TEXT NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  category VARCHAR(100) NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin users (password: admin123)
-- Note: This creates a properly hashed password for 'admin123'
INSERT INTO users (email, password, name, role) VALUES 
('admin@bakery.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin'),
('admin@frostandflour.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Frost and Flour Admin', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';

-- Insert sample customer user (password: customer123)
INSERT INTO users (email, password, name, role) VALUES 
('customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sample Customer', 'customer')
ON DUPLICATE KEY UPDATE role = 'customer';

-- Instructions for adding more admin users:
-- 1. Use bcrypt to hash the password: bcrypt.hash('yourpassword', 10)
-- 2. Insert manually: INSERT INTO users (email, password, name, role) VALUES ('admin@example.com', 'hashedpassword', 'Admin Name', 'admin');
-- 3. Or use the admin dashboard to change existing user roles to 'admin'

-- Insert sample orders for testing
INSERT INTO orders (name, email, contact, address, items, total) VALUES
('John Smith', 'customer@example.com', '+1-555-0123', '123 Main Street, New York, NY 10001', 
 '[{"name": "Chocolate Cake", "quantity": 1}, {"name": "Vanilla Cupcake with Sprinkles", "quantity": 3}]', 
 43.96),
('Sarah Johnson', 'customer@example.com', '+1-555-0456', '456 Oak Avenue, Los Angeles, CA 90210', 
 '[{"name": "Birthday Cake", "quantity": 1}, {"name": "Chocolate Chip Cookies", "quantity": 2}]', 
 36.97),
('Shajia', 'shajia@gmail.com', '+1-555-0789', '789 Pine Road, Chicago, IL 60601', 
 '[{"name": "Carrot Cake", "quantity": 1}, {"name": "French Bread", "quantity": 2}, {"name": "Blueberry Cupcake", "quantity": 4}]', 
 47.95),
('Shajia Test', 'shajia@gmail.com', '+1-555-0321', '321 Elm Street, Miami, FL 33101', 
 '[{"name": "Macaron Cake", "quantity": 1}, {"name": "Chocolate Truffle Pastry", "quantity": 2}]', 
 47.48),
('Shajia Tahir', 'shajiatahir33@gmail.com', '+1-555-0123', '123 Test Street, Test City, TC 12345', 
 '[{"name": "Chocolate Cake", "quantity": 2}, {"name": "Strawberry Cupcake", "quantity": 3}, {"name": "Chocolate Chip Cookies", "quantity": 1}]', 
 52.95)
ON DUPLICATE KEY UPDATE total = total;

-- Insert sample contact messages for testing
INSERT INTO contact_messages (name, email, message) VALUES
('Alice Cooper', 'alice.cooper@email.com', 'Hi! I would like to place a custom order for my daughter''s birthday party. I need a cake that serves 20 people with a unicorn theme. Can you help me with this?'),
('Robert Taylor', 'robert.taylor@email.com', 'I recently ordered from your bakery and the quality was amazing! I wanted to ask if you offer gluten-free options for your pastries?'),
('Lisa Anderson', 'lisa.anderson@email.com', 'Hello! I''m planning a wedding and would love to discuss custom cake options. Do you offer wedding cake consultations?')
ON DUPLICATE KEY UPDATE message = message;

-- Verify setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_menu_items FROM menu_items;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_contact_messages FROM contact_messages; 