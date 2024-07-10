const mongoose = require('mongoose');
 
const reportSchema = new mongoose.Schema({
  totalSales: {
    type: Number,
    required: true,
    default: 0
  },
  totalOrders: {
    type: Number,
    required: true,
    default: 0
  },
  bestSeller: {
    type: String,
    required: true
  },
  // You can add additional fields if needed
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});
 
const Report = mongoose.model('Report', reportSchema);
 
module.exports = Report;