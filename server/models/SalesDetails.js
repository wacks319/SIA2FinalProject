const mongoose = require('mongoose');
 
const salesDetailSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // You can add additional fields if needed
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});
 
const SalesDetail = mongoose.model('SalesDetail', salesDetailSchema);
 
module.exports = SalesDetail;