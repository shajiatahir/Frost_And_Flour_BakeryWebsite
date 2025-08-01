const pool = require('./db')

const Contact = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY date DESC')
    return rows
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id])
    return rows[0]
  },
  async create(message) {
    const { name, email, message: msg } = message
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, message, date) VALUES (?, ?, ?, NOW())',
      [name, email, msg]
    )
    return this.getById(result.insertId)
  },
  async delete(id) {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [id])
    return { success: true }
  }
}

module.exports = Contact 