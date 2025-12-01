const connection = require('../config/db');
const bcrypt = require('bcrypt');
const { userCreateSchema, userUpdateSchema } = require('../validations/userValidation');

const saltRounds = 10;

exports.getAllUsers = (req, res) => {
  connection.query('SELECT id, username, email FROM user', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const id = req.params.id;
  connection.query('SELECT id, username, email FROM user WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(results[0]);
  });
};

exports.createUser = (req, res) => {
  try {
    const { username, password, email } = userCreateSchema.parse(req.body);

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: 'Gagal hash password' });

      connection.query(
        'INSERT INTO user (username, hashed_password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email],
        (err, results) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({ error: 'Username atau email sudah digunakan' });
            }
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ id: results.insertId, username, email });
        }
      );
    });
  } catch (e) {
    res.status(400).json({ error: e.errors });
  }
};

exports.updateUser = (req, res) => {
  const id = req.params.id;

  try {
    const updateData = userUpdateSchema.parse(req.body);

    if (updateData.password) {
      // hash password jika ada update password
      bcrypt.hash(updateData.password, saltRounds, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: 'Gagal hash password' });

        updateData.hashed_password = hashedPassword;
        delete updateData.password;

        proceedUpdate();
      });
    } else {
      proceedUpdate();
    }

    function proceedUpdate() {
      const fields = [];
      const values = [];

      for (const key in updateData) {
        fields.push(`${key === 'hashed_password' ? 'hashed_password' : key} = ?`);
        values.push(updateData[key]);
      }

      if (fields.length === 0) {
        return res.status(400).json({ message: "Tidak ada data untuk diupdate" });
      }

      values.push(id);

      const sql = `UPDATE user SET ${fields.join(', ')} WHERE id = ?`;

      connection.query(sql, values, (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username atau email sudah digunakan' });
          }
          return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json({ message: "User berhasil diupdate" });
      });
    }
  } catch (e) {
    res.status(400).json({ error: e.errors });
  }
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM user WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "User berhasil dihapus" });
  });
};
