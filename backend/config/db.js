const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // sesuaikan username MySQL Anda
  password: '',       // sesuaikan password MySQL Anda
  database: 'gundam_store'
});

connection.connect((err) => {
  if (err) {
    console.error('Error koneksi database:', err);
    return;
  }
  console.log('Database MySQL terkoneksi!');
});

module.exports = connection;
