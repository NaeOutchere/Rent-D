const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS: MongoDB connected!');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ ERROR:', err.message);
    process.exit(1);
  });
