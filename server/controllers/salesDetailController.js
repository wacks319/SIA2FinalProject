const SalesDetail = require('../models/SalesDetails');
 
// Create a new sales detail
const createSalesDetail = async (req, res) => {
  try {
    const { product, quantity, price, date } = req.body;
 
    const newSalesDetail = new SalesDetail({
      product,
      quantity,
      price,
      date
    });
 
    const savedSalesDetail = await newSalesDetail.save();
    res.status(201).json(savedSalesDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sales detail', error });
  }
};
 
// Get all sales details
const getAllSalesDetails = async (req, res) => {
  try {
    const salesDetails = await SalesDetail.find();
    res.status(200).json(salesDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales details', error });
  }
};
 
// Get a single sales detail by ID
const getSalesDetailById = async (req, res) => {
  try {
    const salesDetail = await SalesDetail.findById(req.params.id);
 
    if (!salesDetail) {
      return res.status(404).json({ message: 'Sales detail not found' });
    }
 
    res.status(200).json(salesDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales detail', error });
  }
};
 
// Update a sales detail by ID
const updateSalesDetailById = async (req, res) => {
  try {
    const { product, quantity, price, date } = req.body;
 
    const updatedSalesDetail = await SalesDetail.findByIdAndUpdate(
      req.params.id,
      { product, quantity, price, date },
      { new: true, runValidators: true }
    );
 
    if (!updatedSalesDetail) {
      return res.status(404).json({ message: 'Sales detail not found' });
    }
 
    res.status(200).json(updatedSalesDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sales detail', error });
  }
};
 
// Delete a sales detail by ID
const deleteSalesDetailById = async (req, res) => {
  try {
    const deletedSalesDetail = await SalesDetail.findByIdAndDelete(req.params.id);
 
    if (!deletedSalesDetail) {
      return res.status(404).json({ message: 'Sales detail not found' });
    }
 
    res.status(200).json({ message: 'Sales detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sales detail', error });
  }
};
 
module.exports = {
  createSalesDetail,
  getAllSalesDetails,
  getSalesDetailById,
  updateSalesDetailById,
  deleteSalesDetailById
};