const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

const seedAdmin = async () => {
  const args = process.argv.slice(2);
  const username = args[0];
  const password = args[1];

  if (!username || !password) {
    console.error('Usage: node scripts/seedAdmin.js <username> <password>');
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = await Admin.findOneAndUpdate(
      { username },
      { username, password: hashedPassword },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin account '${admin.username}' created/updated successfully!`);
  } catch (error) {
    console.error('Error seeding admin account:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

seedAdmin();
