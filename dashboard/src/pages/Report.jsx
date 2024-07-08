import React from 'react';
import './Report.css';

export default function Report() {
  return (
    <div className="report-container">
      <h1 className="report-title">Report</h1>
      <div className="report-summary">
        <div className="summary-item">
          <h2>Total Sales</h2>
          <p>₱1500</p>
        </div>
        <div className="summary-item">
          <h2>Total Orders</h2>
          <p>25</p>
        </div>
        <div className="summary-item">
          <h2>Best Seller</h2>
          <p>Product 1</p>
        </div>
      </div>
      <div className="report-details">
        <h2>Sales Details</h2>
        <div className="details-header">
          <div className="details-column">Product</div>
          <div className="details-column">Quantity</div>
          <div className="details-column">Price</div>
          <div className="details-column">Date</div>
        </div>
        <div className="details-item">
          <div className="details-column">Product 1</div>
          <div className="details-column">2</div>
          <div className="details-column">₱100</div>
          <div className="details-column">2024-07-08</div>
        </div>
        <div className="details-item">
          <div className="details-column">Product 2</div>
          <div className="details-column">1</div>
          <div className="details-column">₱50</div>
          <div className="details-column">2024-07-08</div>
        </div>
        {/* Add more details items here */}
      </div>
    </div>
  );
}
