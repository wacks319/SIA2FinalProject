import React from 'react';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
import {
    Button,
    // TextField,
    // RadioGroup,
    // FormControlLabel,
    // Radio,
    Modal,
    Backdrop,
    Fade,
    Paper,
    Typography,
    TextField                                          
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Billing.css';
import axios from 'axios';
import { useState } from 'react';

const Billing = ({
    cart,
    setCart,
    // transactionMode,
    // // billingDetails,
    // handleTransactionModeChange,
    // handleBillingChange
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [accountModalOpen, setAccountModalOpen] = useState(false);
    const [accountNumber, setAccountNumber] = useState('');
    const [accountDetails, setAccountDetails] = useState(null);
    const [accountError, setAccountError] = useState('');
    const [depositLoading, setDepositLoading] = useState(false);
    const [depositSuccess, setDepositSuccess] = useState('');
    const [bankUserId, setBankUserId] = useState('');
    const navigate = useNavigate();

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    // Add/Minus quantity handlers
    const handleQuantityChange = (index, delta) => {
        setCart(prevCart => {
            return prevCart.map((item, i) => {
                if (i === index) {
                    let newQty = item.quantity + delta;
                    if (newQty < 1) newQty = 1;
                    if (newQty > item.stock) newQty = item.stock;
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    // Bank logic commented out for Ctrl + / toggle
    /*
    const handleBillingSubmit = async () => {
        try {
            // Send payment request to your classmate's bank API
            const bankResponse = await axios.post('https://your-classmate-bank-api.com/pay', {
                accountNumber: billingDetails.debitAccount,
                amount: getTotalPrice(),
                // ...other required fields
            });
            if (bankResponse.data.success) {
                // Proceed with your order logic
            } else {
                alert('Bank payment failed: ' + bankResponse.data.message);
            }
        } catch (error) {
            alert('Error connecting to bank: ' + error.message);
        }
    };
    */
    // Placeholder submit handler
    const handleBillingSubmit = () => {
        setAccountModalOpen(true);
        setAccountNumber('');
        setAccountDetails(null);
        setAccountError('');
        setDepositSuccess('');
    };

    const handleAccountNumberChange = async (e) => {
        const value = e.target.value;
        setAccountNumber(value);
        setAccountDetails(null);
        setAccountError('');
        setDepositSuccess('');
        setBankUserId('');
        if (value.length > 0) {
            try {
                // Fetch from bank API
                const res = await axios.get('http://192.168.8.201:5000/api/users');
                const user = res.data.find(u => u.accountNumber === value);
                if (user) {
                    setAccountDetails(user);
                    setBankUserId(user._id); // Store bank user ID
                } else {
                    setAccountError('Account not found.');
                }
            } catch (err) {
                setAccountError('Error fetching account details.');
            }
        }
    };

    // TODO: Replace this with the actual seller's bank account number (from product/seller data)
    const sellerAccountNumber = '355690186992'; // Example seller account number

    const handleDepositConfirm = async () => {
        if (!accountDetails || !bankUserId) {
            setAccountError('No bank user found. Please check the account number.');
            return;
        }
        setDepositLoading(true);
        setDepositSuccess('');
        setAccountError('');
        // Save a copy of the cart before clearing
        const cartBeforeClear = [...cart];
        const totalPrice = getTotalPrice();
        const paymentMethod = 'BPI';
        const buyerAccountNumber = accountNumber;
        try {
            // Deduct from bank account only (integration demo)
            const res = await axios.post('http://192.168.8.201:5000/api/users/withdraw', {
                userId: bankUserId,
                amount: totalPrice,
            });
            console.log('Bank withdraw response:', res.data);
            if (res.data.success || res.status === 200) {
                setDepositSuccess('Payment successful!');
                setCart([]);
                setAccountModalOpen(false);
                setTimeout(() => {
                    navigate('/receipt', {
                        state: {
                            purchased: cartBeforeClear,
                            total: totalPrice,
                            paymentMethod,
                            buyerAccountNumber
                        }
                    });
                }, 100);
            } else {
                setAccountError(res.data.message || 'Withdrawal failed.');
            }
        } catch (err) {
            setAccountError('Error processing payment.');
        } finally {
            setDepositLoading(false);
        }
    };

    return (
        <div className="billing-container" style={{ minHeight: '100vh', background: '#f9f6f7', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 40 }}>
            <Paper elevation={4} sx={{ borderRadius: 4, p: 4, minWidth: 380, maxWidth: 480, width: '100%', background: '#fff', boxShadow: '0 4px 32px #7b1e3d22' }}>
                <Typography variant="h4" sx={{ color: '#7b1e3d', fontWeight: 700, fontFamily: 'serif', mb: 1, letterSpacing: 1 }}>Checkout</Typography>
                <Typography variant="subtitle1" sx={{ color: '#b8860b', fontWeight: 500, mb: 2 }}>Review your cart and pay securely</Typography>
                <hr style={{ border: 'none', borderTop: '1.5px dashed #b8860b33', margin: '12px 0' }} />
                <div style={{ margin: '20px 0' }}>
                    {cart.map((item, idx) => (
                        <div key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, background: '#f9e6ed', borderRadius: 8, padding: '8px 12px' }}>
                            <Typography style={{ flex: 1, color: '#7b1e3d', fontWeight: 600 }}>{item.name}</Typography>
                            <Button onClick={() => handleQuantityChange(idx, -1)} variant="outlined" size="small" sx={{ minWidth: 32, mr: 1, borderColor: '#b93a5d', color: '#b93a5d' }}>-</Button>
                            <Typography style={{ width: 32, textAlign: 'center', color: '#7b1e3d', fontWeight: 600 }}>{item.quantity}</Typography>
                            <Button onClick={() => handleQuantityChange(idx, 1)} variant="outlined" size="small" sx={{ minWidth: 32, ml: 1, borderColor: '#b93a5d', color: '#b93a5d' }}>+</Button>
                            <Typography style={{ marginLeft: 16, color: '#b8860b', fontWeight: 500 }}>Stock: {item.stock}</Typography>
                        </div>
                    ))}
                </div>
                <hr style={{ border: 'none', borderTop: '1.5px dashed #b8860b33', margin: '12px 0' }} />
                <Typography variant="h6" sx={{ color: '#7b1e3d', fontWeight: 700, mb: 1 }}>Total: <span style={{ color: '#b8860b' }}>₱{getTotalPrice()}</span></Typography>
                <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
                    <Button variant="contained" onClick={handleBillingSubmit} sx={{ background: '#7b1e3d', color: '#fff', fontWeight: 600, borderRadius: 2, fontSize: 18, boxShadow: '0 2px 8px #7b1e3d11', flex: 1 }}>Submit Payment</Button>
                    <Button variant="outlined" sx={{ background: '#fff', color: '#b8860b', border: '1.5px solid #b8860b', fontWeight: 600, borderRadius: 2, fontSize: 18, flex: 1 }} onClick={() => navigate('/dashboard')}>Cancel</Button>
                </div>
            </Paper>
            {/* Account Number Modal */}
            <Modal open={accountModalOpen} onClose={() => setAccountModalOpen(false)}>
                <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 12, borderRadius: 4, background: '#fff', boxShadow: '0 4px 32px #7b1e3d22' }}>
                    <Typography variant="h5" sx={{ color: '#7b1e3d', fontWeight: 700, mb: 2 }}>Pay with BPI</Typography>
                    <TextField
                        label="Account Number"
                        value={accountNumber}
                        onChange={handleAccountNumberChange}
                        fullWidth
                        autoFocus
                        sx={{ mb: 2, background: '#f9e6ed', borderRadius: 2 }}
                        InputLabelProps={{ style: { color: '#7b1e3d' } }}
                    />
                    {accountError && <div style={{ color: 'red', marginBottom: 8 }}>{accountError}</div>}
                    {accountDetails && (
                        <div style={{ marginBottom: 12, background: '#f9e6ed', borderRadius: 8, padding: 8 }}>
                            <div><b>Name:</b> {accountDetails.username}</div>
                            <div><b>Bank:</b> BPI</div>
                            <div><b>Account Number:</b> {accountDetails.accountNumber}</div>
                        </div>
                    )}
                    {depositSuccess && <div style={{ color: 'green', marginBottom: 8 }}>{depositSuccess}</div>}
                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <Button variant="contained" onClick={handleDepositConfirm} disabled={!accountDetails || depositLoading} sx={{ background: '#7b1e3d', color: '#fff', fontWeight: 600, borderRadius: 2, fontSize: 16, flex: 1 }}>
                            {depositLoading ? 'Processing...' : 'Confirm Payment'}
                        </Button>
                        <Button variant="outlined" onClick={() => setAccountModalOpen(false)} sx={{ borderColor: '#b93a5d', color: '#b93a5d', fontWeight: 600, borderRadius: 2, fontSize: 16, flex: 1 }}>
                            Cancel
                        </Button>
                    </div>
                </Paper>
            </Modal>
        </div>
    );
};

Billing.propTypes = {
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            quantity: PropTypes.number.isRequired,
            stock: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            _id: PropTypes.string.isRequired
        })
    ).isRequired,
    setCart: PropTypes.func.isRequired,
    // transactionMode: PropTypes.string.isRequired,
    // billingDetails: PropTypes.shape({
    //     debitAccount: PropTypes.string
    // }),
    // handleTransactionModeChange: PropTypes.func.isRequired,
    // handleBillingChange: PropTypes.func.isRequired
};

export default Billing;
