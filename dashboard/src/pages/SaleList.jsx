import React from 'react';
import './SaleList.css';

export default function SaleList() {
  return (
    <div className="sales-list-container">
      <h1 className="sales-list-title">Sales</h1>
      <div className="sales-list-header">
        <div className="sales-list-column">Product</div>
        <div className="sales-list-column">Quantity</div>
        <div className="sales-list-column">Price</div>
        <div className="sales-list-column">Date</div>
      </div>
      <div className="sales-list-item">
        <div className="sales-list-column">Product 1</div>
        <div className="sales-list-column">2</div>
        <div className="sales-list-column">₱100</div>
        <div className="sales-list-column">2024-07-08</div>
      </div>
      <div className="sales-list-item">
        <div className="sales-list-column">Product 2</div>
        <div className="sales-list-column">1</div>
        <div className="sales-list-column">₱50</div>
        <div className="sales-list-column">2024-07-08</div>
      </div>
      {/* Add more sales list items here */}
    </div>
  );
}
