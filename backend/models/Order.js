const pool = require('./db')

const Order = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY date DESC')
    for (const order of rows) {
      order.items = JSON.parse(order.items)
    }
    return rows
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id])
    if (rows[0]) rows[0].items = JSON.parse(rows[0].items)
    return rows[0]
  },
  async create(order) {
    const { name, email, contact, address, items, total } = order
    const itemsStr = JSON.stringify(items)
    const [result] = await pool.query(
      'INSERT INTO orders (name, email, contact, address, items, total, date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email, contact, address, itemsStr, total]
    )
    return this.getById(result.insertId)
  },
  async update(id, order) {
    const { name, email, contact, address, items, total } = order
    const itemsStr = JSON.stringify(items)
    await pool.query(
      'UPDATE orders SET name=?, email=?, contact=?, address=?, items=?, total=? WHERE id=?',
      [name, email, contact, address, itemsStr, total, id]
    )
    return this.getById(id)
  },
  async delete(id) {
    await pool.query('DELETE FROM orders WHERE id = ?', [id])
    return { success: true }
  }
}

module.exports = Order 