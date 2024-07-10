const Report = require('../models/Reports');
const SalesDetail = require('../models/SalesDetails');
 
// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { totalSales, totalOrders, bestSeller } = req.body;
    const newReport = new Report({
      totalSales,
      totalOrders,
      bestSeller
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error });
  }
};
 
// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};
 
// Get a single report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error });
  }
};
 
// Update a report
exports.updateReport = async (req, res) => {
  try {
    const { totalSales, totalOrders, bestSeller } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, {
      totalSales,
      totalOrders,
      bestSeller
    }, { new: true });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error updating report', error });
  }
};
 
// Delete a report
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error });
  }
};
 
// Record a transaction and update the report
exports.recordTransaction = async (req, res) => {
  const { product, quantity, price } = req.body;
 
  try {
    const salesDetail = new SalesDetail({ product, quantity, price });
    await salesDetail.save();
 
    // Find the current report or create a new one if it doesn't exist
    let report = await Report.findOne();
    if (!report) {
      report = new Report();
    }
 
    // Update total sales and total orders
    report.totalSales += price * quantity;
    report.totalOrders += 1;
 
    // Logic to determine the best seller (simplified example)
    // Assuming that the best seller is determined by the highest total quantity sold
    // You can replace this logic based on your actual criteria
    if (!report.bestSeller || report.bestSeller === product) {
      report.bestSeller = product;
    } else {
      const existingBestSeller = await SalesDetail.find({ product: report.bestSeller });
      const newProductSales = await SalesDetail.find({ product });
      const existingBestSellerTotal = existingBestSeller.reduce((sum, sale) => sum + sale.quantity, 0);
      const newProductTotal = newProductSales.reduce((sum, sale) => sum + sale.quantity, 0);
 
      if (newProductTotal > existingBestSellerTotal) {
        report.bestSeller = product;
      }
    }
 
    await report.save();
 
    res.status(201).json(salesDetail);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record transaction', error });
  }
};
 