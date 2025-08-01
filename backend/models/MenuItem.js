const pool = require('./db')

const MenuItem = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM menu_items')
    return rows
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id])
    return rows[0]
  },
  async create(item) {
    const { name, img, price, desc, rating, category } = item
    const [result] = await pool.query(
      'INSERT INTO menu_items (name, img, price, `desc`, rating, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, img, price, desc, rating, category]
    )
    return { id: result.insertId, ...item }
  },
  async update(id, item) {
    const { name, img, price, desc, rating, category } = item
    await pool.query(
      'UPDATE menu_items SET name=?, img=?, price=?, `desc`=?, rating=?, category=? WHERE id=?',
      [name, img, price, desc, rating, category, id]
    )
    return { id, ...item }
  },
  async delete(id) {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [id])
    return { success: true }
  }
}

module.exports = MenuItem 