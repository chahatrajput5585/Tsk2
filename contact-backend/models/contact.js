// backend/models/contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  // Add other fields as needed
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
