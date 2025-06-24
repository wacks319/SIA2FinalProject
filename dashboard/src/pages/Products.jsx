import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import Billing from '../pages/Billing';
import Receipt from '../pages/Receipt';
import { useNavigate } from 'react-router-dom';
import './Products.css';

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

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

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
                                <img src={`http://localhost:3004/uploads/${product.image}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <h4>₱ {product.price}</h4>
                                <h4>Stock: {product.stock}</h4>
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
                        <div key={index} className="cart-item">
                            <h3>{item.name}</h3>
                            <p>₱ {item.price} x {item.quantity}</p>
                            <Button variant="contained" onClick={() => handleRemoveFromCart(index)}>Remove</Button>
                        </div>
                    ))}
                    <h3 className="total-price">Total: ₱ {getTotalPrice()}</h3>
                    <Button variant="contained" onClick={handleCheckout}>Checkout</Button>
                </div>
            )}

            {view === 'billing' && !showReceipt && (
                <Billing
                    cart={cart}
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
