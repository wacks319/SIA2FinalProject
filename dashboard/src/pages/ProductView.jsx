import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FavoriteBorder } from '@mui/icons-material';
import './ProductView.css';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3004/getproduct/${id}`);
        setProduct(res.data?.data);
      } catch (err) {
        setError('Product not found.');
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const existing = cart.find(item => item._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: Math.min(Number(item.quantity) + Number(quantity), product.stock) }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: Number(quantity) }];
    }
    setCart(newCart);
    window.localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleAddToWishlist = () => {
    if (!wishlist.find(item => item._id === product._id)) {
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      window.localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  if (error) return <div className="product-view-error">{error}</div>;
  if (!product) return <div className="product-view-loading">Loading...</div>;

  return (
    <div className="product-view-container">
      <button className="product-view-back" onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="product-view-card">
        <div className="product-view-image">
          <img src={`http://localhost:3004/uploads/${product.image}`} alt={product.name} />
        </div>
        <div className="product-view-details">
          <h2>{product.name}</h2>
          <h3>₱ {parseFloat(product.price).toFixed(2)}</h3>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p>{product.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</button>
            <input type="number" min="1" max={product.stock} value={quantity} onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))} style={{ width: 48, textAlign: 'center' }} />
            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleAddToCart} style={{ background: '#7b1e3d', color: '#fff', fontWeight: 600, borderRadius: 8, padding: '8px 18px', border: 'none', fontSize: 16, cursor: 'pointer' }}>Add to Cart</button>
            <button onClick={handleAddToWishlist} style={{ background: '#fff', color: '#7b1e3d', border: '2px solid #7b1e3d', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FavoriteBorder sx={{ fontSize: 20 }} /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
