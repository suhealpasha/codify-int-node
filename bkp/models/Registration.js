const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  agenceyid: {
    type: Number,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  address1: {
    type: String,
    trim: true,
  },
  address2: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  phone: {
    type: Number,
    trim: true,
  },
 
});

module.exports = mongoose.model('Registration', registrationSchema);
