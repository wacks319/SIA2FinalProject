import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import './Products.css';
import Billing from '../pages/Billing';
 
const Products = () => {
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [transactionMode, setTransactionMode] = useState('creditCard');
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
            const routingNumber = "000000010"
            const response = await axios.get('http://192.168.10.24:3004/getallproducts');
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
        setCart((prevCart) => [...prevCart, product]);
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
            const token = "$2b$10$Roa1/HkD1qYNYfexMl.kAuwiwWbLy3oXQ/pEsGnfLHUeH4I4w3d.i";
            const debit = values.debitAccount;
            const credit = values.creditAccount;
            const amount = getTotalPrice();
 
            const response = await axios.post('http://192.168.10.14:3001/api/unionbank/transfertransaction', {
                debitAccount: debit,
                creditAccount: credit,
                amount: amount
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
 
            console.log(response?.data);
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    };
 
    return (
        <div className="app-container">
            <nav className="navbar">
                <Button onClick={() => setView('shop')}>Shop</Button>
                <Button onClick={() => setView('cart')}>Cart ({cart.length})</Button>
            </nav>
 
            {view === 'shop' && (
                <div className="shop-container">
                    <h2>Shop</h2>
                    <div className="products-list">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <img src={`http://192.168.10.24:3004/uploads/${product.image}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <h4>₱ {product.price}</h4>
                                <Button variant="contained" onClick={() => addToCart(product)}>Add to Cart</Button>
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
                            <p>₱ {product.price}</p>
                            <Button variant="contained" onClick={() => handleRemoveFromCart(index)}>Remove</Button>
                        </div>
                    ))}
                    <h3>Total: ₱ {getTotalPrice()}</h3>
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