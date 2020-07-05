const mongoose = require('mongoose');

const clientRegistrationSchema = new mongoose.Schema({
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
    type: Number,
    trim: true,
  } 
});

module.exports = mongoose.model('ClientRegistration', clientRegistrationSchema);
