import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Dashboard.css';
import Navbar from './Navbar';
import PropTypes from 'prop-types';
import ManageProduct from './ManageProduct';

function Dashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3004/getallproducts');
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const addToCart = () => {
    console.log(`Adding ${quantity} of ${selectedProduct?.name} to cart`);
    closeModal();
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value >= 1 ? value : 1);
  };

  if (!user) return <div>Please log in.</div>;

  return (
    <div className="dashboard">
      <Navbar />
      {user.role === 'buyer' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0' }}>
          {/* Removed Dashboard button for buyer */}
        </div>
      )}

      <div className="image-section">
        <Slider {...settings}>
          <div><img src="/carousel1.png" alt="Slide 1" /></div>
          <div><img src="/carousel2.png" alt="Slide 2" /></div>
          <div><img src="/carousel3.png" alt="Slide 3" /></div>
        </Slider>
      </div>

      <div className="main-section">
        <h2>Welcome to Bookly!</h2>
        <p>
          Bookly is a digital library platform that provides easy access to a wide collection of e-books.
        </p>
      </div>

      <div className="menu">
        <h1>Books</h1>
        {error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="menu-container">
            {products.map((product) => (
              <div
                key={product._id}
                className="card"
                onClick={() => openModal(product)}
              >
                <div className="image-container">
                  <img src={`http://localhost:3004/uploads/${product.image}`} alt={product.name} />
                </div>
                <div className="label">
                  <h3>{product.name}</h3>
                </div>
                <div className="description">
                  <p>{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <div className="product-modal">
          <div className="modal-content">
            <h2>{selectedProduct.name}</h2>
            <img src={`http://localhost:3004/uploads/${selectedProduct.image}`} alt={selectedProduct.name} />
            <p>{selectedProduct.description}</p>
            <p><strong>Price:</strong> ₱{selectedProduct.price}</p>
            <label>
              Quantity:
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={handleQuantityChange}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={addToCart}>Add to Cart</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {user.role === 'admin' && (
        <div>
          <h2>Admin Panel</h2>
          <ul>
            <li>Manage Users (feature coming soon)</li>
            <li><ManageProduct /></li>
            <li>View Sales (feature coming soon)</li>
          </ul>
        </div>
      )}
      {user.role === 'seller' && (
        <div>
          <h2>Seller Panel</h2>
          <ul>
            <li><ManageProduct /></li>
            <li>View Sales (feature coming soon)</li>
          </ul>
        </div>
      )}
      {/* Only show Buyer Panel for buyers, no manage product/account */}
      {user.role === 'buyer' && (
        <div>
          <h2>Buyer Panel</h2>
          <ul>
            <li>Add to Cart</li>
            <li>Purchase</li>
            <li>Check Details</li>
          </ul>
        </div>
      )}
    </div>
  );
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default Dashboard;
