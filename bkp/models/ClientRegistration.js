const mongoose = require('mongoose');

const registrationSchemaClient = new mongoose.Schema({
  clientid: {
    type: Number,
    trim: true,
  },
  agenceyid: {
    type: Number,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  totalbill: {
    type: String,
    trim: true,
  } 
 
});

module.exports = mongoose.model('Registration Client', registrationSchemaClient);
