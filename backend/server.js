require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const Admin = require('./models/admin');

const app = express();

connectDB();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'She Can Foundation API is running' });
});

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@shecanfoundation.org';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      await Admin.create({ email, password });
      console.log('Default admin created');
      console.log('   Email:', email);
      console.log('   Password:', password);
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`\nShe Can Foundation Server running on port ${PORT}`);
  await seedAdmin();
});
