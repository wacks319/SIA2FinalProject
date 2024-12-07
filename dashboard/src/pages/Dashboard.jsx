import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Dashboard.css';
import Navbar from './Navbar'; // Assuming Navbar is correctly implemented

function Dashboard() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true
  };

  const [values, setValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://localhost:3004/getallproducts');
      setValues(response?.data?.data || []); // Ensure to handle empty response or errors
    } catch (error) {
      console.error('Error fetching menu:', error);
      setError('Error fetching menu. Please try again later.');
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
    <div className="dashboard">
        <Navbar />
      <div className='image-section'>
        {/* <Slider {...settings}>
          <div>
            <img src="carousel1.png" alt="Image 1" />
          </div>
          <div>
            <img src="carousel2.png" alt="Image 2" />
          </div>
          <div>
            <img src="carousel3.png" alt="Image 3" />
          </div>
        </Slider> */}
      </div>
      <div className='main-section'>
        <h2>
          Welcome to the Bookly!
        </h2>
        <p>
        Bookly is a digital library platform that provides easy access to a wide collection of e-books
        </p>
      </div>

      <div className="menu">
        <h1>Books</h1>
        {error ? (
          <p>{error}</p>
        ) : (
          <div className="menu-container">
            {values.map((pro) => (
              <div key={pro?._id} className="card" onClick={() => openModal(pro)}>
                <div className="image-container">
                  <img src={`http://localhost:3004/uploads/${pro?.image}`} alt="" />
                </div>
                <div className="label">
                  <h3>{pro?.name}</h3>
                  {/* <h3>₱ {pro?.price}</h3> */}
                </div>
                <div className="description">
                  <p>{pro?.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
