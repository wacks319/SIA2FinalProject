import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import './Products.css';
import ShopNavbar from './ShopNavbar'; // Assuming Navbar is correctly implemented
import Billing from '../pages/Billing';
 
const Products = () => {
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [transactionMode, setTransactionMode] = useState('creditCard');
    //addded
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [values, setValues] = useState({
        debitAccount: '',
        creditAccount: '',
        amount: ''
    });
 
    useEffect(() => {
        fetchProducts();
    }, []);
 
    const fetchProducts = async () => {
        try {
            const routingNumber = "000000010";
            const response = await axios.get('http://localhost:3004/getallproducts');
            setProducts(response?.data?.data || []);
            setValues((prev) => ({
                ...prev,
                creditAccount: routingNumber
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
 
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item._id === product._id);
            if (existingProduct) {
                if (existingProduct.quantity < product.stock) {
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
        return cart.reduce((total, product) => total + parseInt(product.price), 0);
    };
 
    const handleCheckout = () => {
        setView('billing');
    };
 
    const handleTransactionModeChange = (event) => {
        setTransactionMode(event.target.value);
    };
 
    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value
        }));
        setValues((prev) => ({
            ...prev,
            amount: getTotalPrice()
        }));
    };
 
    const handleBillingSubmit = async () => {
        try {
            const token = "$2b$10$81rZwhHngrfNMcTzlQO82OUELSPLpjD3ZWfc98HjWQ76uFDrOtIku";
            const debit = values.debitAccount;
            const credit = values.creditAccount;
            const amount = getTotalPrice();
            
            // Removed Step 1: Transfer transaction
    
            // Step 2: Record transaction details and update reports
            for (const product of cart) {
                // Record transaction detail
                const transactionResponse = await axios.post('http://localhost:3004/api/salesdetails', {
                    product: product.name,
                    quantity: 1, // Assuming 1 for simplicity, adjust as needed
                    price: product.price,
                    date: new Date()
                });
    
                if (!transactionResponse.data) {
                    throw new Error('Failed to record transaction details');
                }
    
                const productId = product._id; // assuming `_id` field exists in product
                const updatedStock = product.stock - product.quantity;
    
                console.log(product.stock);
                console.log("updated stock:" + updatedStock);
    
                const stockResponse = await axios.post('http://localhost:3004/editproductstock', {
                    productId: productId,
                    productStock: updatedStock
                });
    
                // Update the local state to reflect the updated stock
                setProducts((prevProducts) =>
                    prevProducts.map((p) =>
                        p._id === productId ? { ...p, stock: updatedStock } : p
                    )
                );
    
                // Update Reports model
                const reportsResponse = await axios.get('http://localhost:3004/api/reportdetails');
                const reports = reportsResponse.data.data;
    
                if (!Array.isArray(reports) || reports.length === 0) {
                    // Create new report if none exists
                    await axios.post('http://localhost:3004/api/reportdetails', {
                        totalSales: product.price,
                        totalOrders: 1,
                        bestSeller: product.name
                    });
                } else {
                    // Update existing report
                    const update = reports[0];
                    update.totalSales += product.price;
                    update.totalOrders++;
                    await axios.put(`http://localhost:3004/api/reportdetails/${update._id}`, update);
                }
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    };
    
 
    const categories = ['All', 'Anime', 'Action', 'Horror'];
 
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };
 
    const filteredValues= selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);

    return (
        <div className="app-container">
             <ShopNavbar />
            <nav className="navbar">
                {/* <Button onClick={() => setView('shop')} startIcon={<StorefrontIcon />} sx={{ color: 'black' }}>Shop</Button>
                <Button onClick={() => setView('cart')} startIcon={<ShoppingCartIcon />} sx={{ color: 'black' }}>Cart ({cart.length})</Button> */}

            </nav>

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
                        {filteredValues.map((product) => (
                            <div key={product._id} className="product-card">
                                <img src={`http://localhost:3004/uploads/${product.image}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                {/* <h4>₱ {product.price}</h4> */}
                                {/* <h4>Stock:  {product.stock}</h4> */}
                                {/* <Button
                                variant="contained"
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                            >
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button> */}

                            </div>
                        ))}
                    </div>
                </div>
            )}

{view === 'cart' && (
                <div className="cart-container">
                    <h2>Cart</h2>
                    {cart.map((product, index) => (
                        <div key={index} className="cart-item">
                            <h3>{product.name}</h3>
                            <p>₱ {product.price} x {product.quantity}</p>
                            <Button variant="contained" onClick={() => handleRemoveFromCart(index)}>Remove</Button>
                        </div>
                    ))}
                    <h3 className="total-price">Total: ₱ {getTotalPrice()}</h3>
                    <Button variant="contained" onClick={handleCheckout}>Checkout</Button>
                </div>
            )}

            {view === 'billing' && (
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
        </div>
    );
};

export default Products;
