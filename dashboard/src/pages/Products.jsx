import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import Billing from '../pages/Billing';
import Receipt from '../pages/Receipt';
import { useNavigate } from 'react-router-dom';
import './Products.css';
import ProductInfoModal from '../components/ProductInfoModal';
import ProductRating from '../components/ProductRating';

const Products = () => {
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [transactionMode, setTransactionMode] = useState('creditCard');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [values, setValues] = useState({
        debitAccount: '',
        creditAccount: '',
        amount: ''
    });
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [productRatings, setProductRatings] = useState({}); // { productId: rating }

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    // Save ratings to localStorage for persistence (buyer-side only)
    useEffect(() => {
        const savedRatings = localStorage.getItem('productRatings');
        if (savedRatings) {
            setProductRatings(JSON.parse(savedRatings));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('productRatings', JSON.stringify(productRatings));
    }, [productRatings]);

    const fetchProducts = async () => {
        try {
            const routingNumber = "000000010";
            const response = await axios.get('http://localhost:3004/getallproducts');
            setProducts(response?.data?.data || []);
            setValues((prev) => ({ ...prev, creditAccount: routingNumber }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find(item => item._id === product._id);
            if (existing) {
                if (existing.quantity < product.stock) {
                    return prevCart.map(item =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    alert('Not enough stock available');
                    return prevCart;
                }
            } else {
                if (product.stock > 0) {
                    return [...prevCart, { ...product, quantity: 1 }];
                } else {
                    alert('Not enough stock available');
                    return prevCart;
                }
            }
        });
    };

    const handleRemoveFromCart = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        setView('billing');
    };

    const handleTransactionModeChange = (e) => {
        setTransactionMode(e.target.value);
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value, amount: getTotalPrice() }));
    };

    const handleBillingSubmit = async () => {
        try {
            for (const product of cart) {
                await axios.post('http://localhost:3004/api/salesdetails', {
                    product: product.name,
                    quantity: product.quantity,
                    price: product.price,
                    date: new Date()
                });

                const updatedStock = product.stock - product.quantity;
                await axios.post('http://localhost:3004/editproductstock', {
                    productId: product._id,
                    productStock: updatedStock
                });

                setProducts((prev) =>
                    prev.map((p) => p._id === product._id ? { ...p, stock: updatedStock } : p)
                );

                const reports = (await axios.get('http://localhost:3004/api/reportdetails')).data.data;

                if (!Array.isArray(reports) || reports.length === 0) {
                    await axios.post('http://localhost:3004/api/reportdetails', {
                        totalSales: product.price,
                        totalOrders: 1,
                        bestSeller: product.name
                    });
                } else {
                    const update = reports[0];
                    update.totalSales += product.price;
                    update.totalOrders++;
                    await axios.put(`http://localhost:3004/api/reportdetails/${update._id}`, update);
                }
            }
            setShowReceipt(true); // Show receipt after successful payment
        } catch (error) {
            console.error('Error submitting billing:', error);
        }
    };

    const categories = ['All', 'Anime', 'Action', 'Horror'];

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredValues = selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/Login');
    };

    const handleRateProduct = (product, rating) => {
        setProductRatings(prev => ({ ...prev, [product._id]: rating }));
    };

    return (
        <div className="app-container">

            <div className="category-list">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'contained' : 'outlined'}
                        onClick={() => handleCategoryChange(category)}
                        sx={{ marginRight: '10px', marginBottom: '10px' }}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {view === 'shop' && (
                <div className="shop-container">
                    <h2>Books</h2>
                    <div className="products-list">
                        {filteredValues.map(product => (
                            <div key={product._id} className="product-card">
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setModalOpen(true);
                                    }}
                                >
                                    <img src={`http://localhost:3004/uploads/${product.image}`} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <h4>₱ {product.price}</h4>
                                    <h4>Stock: {product.stock}</h4>
                                    <div style={{ marginTop: 8 }}>
                                        <span style={{ fontSize: '0.95rem', color: '#b8860b', marginRight: 6 }}> Rating:</span>
                                        <span>
                                            <ProductRating
                                                value={productRatings[product._id] || 0}
                                                onChange={(_, newValue) => handleRateProduct(product, newValue)}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (localStorage.getItem('token')) {
                                            addToCart(product);
                                        } else {
                                            navigate('/Login');
                                        }
                                    }}
                                    disabled={product.stock === 0}
                                >
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                            </div>
                        ))}
                    </div>
                    <ProductInfoModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        product={selectedProduct}
                        onAddToCart={(product) => {
                            addToCart(product);
                            setModalOpen(false);
                        }}
                        onRate={handleRateProduct}
                        userRating={selectedProduct ? productRatings[selectedProduct._id] : 0}
                    />
                    {/* View Cart button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setView('cart')}
                        disabled={cart.length === 0}
                        style={{ marginTop: '20px' }}
                    >
                        View Cart ({cart.length})
                    </Button>
                </div>
            )}

            {view === 'cart' && (
                <div className="cart-container">
                    <h2>Cart</h2>
                    {cart.map((item, index) => (
                        <div key={index} className="cart-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h3 style={{ flex: 1 }}>{item.name}</h3>
                            <Button onClick={() => {
                                setCart(prevCart => prevCart.map((c, i) => i === index ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c));
                            }} variant="outlined" size="small" style={{ minWidth: 32 }}>-</Button>
                            <span style={{ width: 32, textAlign: 'center' }}>{item.quantity}</span>
                            <Button onClick={() => {
                                setCart(prevCart => prevCart.map((c, i) => i === index ? { ...c, quantity: Math.min(c.stock, c.quantity + 1) } : c));
                            }} variant="outlined" size="small" style={{ minWidth: 32 }}>+</Button>
                            <span style={{ color: '#b8860b', marginLeft: 8 }}>Stock: {item.stock}</span>
                            <Button variant="contained" onClick={() => handleRemoveFromCart(index)} style={{ marginLeft: 8 }}>Remove</Button>
                        </div>
                    ))}
                    <h3 className="total-price">Total: ₱ {getTotalPrice()}</h3>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <Button variant="contained" onClick={handleCheckout}>Checkout</Button>
                        <Button variant="outlined" style={{ background: '#fff', color: '#b8860b', border: '1.5px solid #b8860b' }} onClick={() => setView('shop')}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {view === 'billing' && !showReceipt && (
                <Billing
                    cart={cart}
                    setCart={setCart}
                    transactionMode={transactionMode}
                    billingDetails={values}
                    handleTransactionModeChange={handleTransactionModeChange}
                    handleBillingChange={handleBillingChange}
                    handleBillingSubmit={handleBillingSubmit}
                    getTotalPrice={getTotalPrice}
                />
            )}

            {showReceipt && (
                <Receipt
                    cart={cart}
                    billingDetails={values}
                    transactionMode={transactionMode}
                    total={getTotalPrice()}
                    onClose={() => {
                        setShowReceipt(false);
                        setCart([]);
                        localStorage.removeItem('cart'); // Clear cart from localStorage after purchase
                        if (localStorage.getItem('userRole') === 'buyer') {
                            navigate('/dashboard');
                        } else {
                            navigate('/Login');
                        }
                    }}
                />
            )}
            {/* Only show logout if logged in */}
            {localStorage.getItem('token') && (
                <Button variant="contained" onClick={handleLogout}>Logout</Button>
            )}
        </div>
    );
};

export default Products;
