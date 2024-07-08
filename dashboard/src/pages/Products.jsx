import React, { useEffect, useState } from 'react';
import './Products.css';
import axios from 'axios';
import { Modal, Box, TextField, Button } from '@mui/material';

function Menu() {
  const [values, setValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://192.168.10.24:3004/getallproducts');
      setValues(response?.data?.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1); // Reset quantity
  };

  const addToCart = () => {
    // Implement your add to cart logic here, e.g., send a request to a backend endpoint
    console.log(`Adding ${quantity} of ${selectedProduct?.name} to cart`);
    closeModal(); // Close modal after adding to cart
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value >= 1 ? value : 1); // Ensure quantity is at least 1
  };

  return (
    <div className="menu">
      <h1>Products</h1>
      <div className="menu-container">
        {values?.map((pro) => (
          <div key={pro?._id} className="card" onClick={() => openModal(pro)}>
            <div className="image-container">
              <img src={`http://192.168.10.24:3004/uploads/${pro?.image}`} alt="" />
            </div>
            <div className="label">
              <h3>{pro?.name}</h3>
              <h3>₱ {pro?.price}</h3>
            </div>
            <div className="description">
              <p>{pro?.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box sx={{ ...modalStyle }}>
          <h2>Add to Cart</h2>
          <div className="modal-content">
            <div className="modal-image">
              <img src={`http://192.168.10.24:3004/uploads/${selectedProduct?.image}`} alt="" />
            </div>
            <div className="modal-details">
              <h3>{selectedProduct?.name}</h3>
              <p>{selectedProduct?.description}</p>
              <p>₱ {selectedProduct?.price}</p>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={addToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default Menu;
