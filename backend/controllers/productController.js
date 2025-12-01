const connection = require('../config/db');
const { productCreateSchema, productUpdateSchema } = require('../validations/productValidation');

exports.getAllProducts = (req, res) => {
  connection.query('SELECT * FROM product', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM product WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Product tidak ditemukan' });
    res.json(results[0]);
  });
};

exports.createProduct = (req, res) => {
  try {
    const { name, price, grade } = productCreateSchema.parse(req.body);

    connection.query(
      'INSERT INTO product (name, price, grade) VALUES (?, ?, ?)',
      [name, price, grade],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, name, price, grade });
      }
    );
  } catch (e) {
    res.status(400).json({ error: e.errors });
  }
};

exports.updateProduct = (req, res) => {
  const id = req.params.id;

  try {
    const updateData = productUpdateSchema.parse(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Tidak ada data untuk diupdate" });
    }

    const fields = [];
    const values = [];

    for (const key in updateData) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }

    values.push(id);

    const sql = `UPDATE product SET ${fields.join(', ')} WHERE id = ?`;

    connection.query(sql, values, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Product tidak ditemukan" });
      }
      res.json({ message: "Product berhasil diupdate" });
    });
  } catch (e) {
    res.status(400).json({ error: e.errors });
  }
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM product WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Product tidak ditemukan" });
    res.json({ message: "Product berhasil dihapus" });
  });
};
