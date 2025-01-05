const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'dmweemba@edulution.org' });
    
    if (adminExists) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      name: 'Dabwitso Mweemba',
      email: 'dmweemba@edulution.org',
      password: hashedPassword,
      role: 'superadmin',
      hourlyRate: 100,
      career: 'Administrator'
    });

    console.log('Super admin created:', admin);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdminUser(); 