const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.send('API Gundam Store aktif');
});

app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
