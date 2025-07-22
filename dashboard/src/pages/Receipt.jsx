import PropTypes from 'prop-types';
import { Button, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import './Receipt.css';

const Receipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Updated state keys
    const { purchased = [], total = 0, paymentMethod = '', buyerAccountNumber = '' } = location.state || {};

    return (
        <div style={{ minHeight: '100vh', background: '#f9f6f7', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 40 }}>
            <Paper className="receipt-paper" elevation={4} sx={{ borderRadius: 4, p: 4, minWidth: 380, maxWidth: 480, width: '100%', background: '#fff', boxShadow: '0 4px 32px #7b1e3d22' }}>
                <Typography className="receipt-title" variant="h4" gutterBottom sx={{ color: '#7b1e3d', fontWeight: 700, fontFamily: 'serif', mb: 1, letterSpacing: 1 }}>📚 Bookly Order Receipt</Typography>
                <hr className="receipt-divider" style={{ border: 'none', borderTop: '1.5px dashed #b8860b33', margin: '12px 0' }} />
                <Typography className="receipt-label" variant="subtitle1" sx={{ color: '#b8860b', fontWeight: 500 }}>Payment Method: <span style={{ fontWeight: 'normal', color: '#7b1e3d' }}>{paymentMethod}</span></Typography>
                {buyerAccountNumber && (
                    <Typography className="receipt-item" variant="body2" sx={{ color: '#7b1e3d' }}>
                        Bank Account: <span style={{ fontWeight: 'normal' }}>{buyerAccountNumber}</span>
                    </Typography>
                )}
                <hr className="receipt-divider" style={{ border: 'none', borderTop: '1.5px dashed #b8860b33', margin: '12px 0' }} />
                <Typography className="receipt-label" variant="subtitle1" sx={{ color: '#b8860b', fontWeight: 500 }}>Items:</Typography>
                <div style={{ marginBottom: 8 }}>
                    {purchased.length === 0 ? (
                        <Typography variant="body2">No items found.</Typography>
                    ) : (
                        purchased.map((item, idx) => (
                            <Typography key={idx} className="receipt-item" variant="body2" sx={{ color: '#7b1e3d', background: '#f9e6ed', borderRadius: 2, px: 1, py: 0.5, mb: 1 }}>
                                <span style={{ fontWeight: 'bold' }}>{item.name}</span> x {item.quantity} @ ₱{parseFloat(item.price).toFixed(2)} = <span style={{ color: '#b8860b' }}>₱{(item.price * item.quantity).toFixed(2)}</span>
                            </Typography>
                        ))
                    )}
                </div>
                <hr className="receipt-divider" style={{ border: 'none', borderTop: '1.5px dashed #b8860b33', margin: '12px 0' }} />
                <Typography className="receipt-total" variant="h6" sx={{ color: '#7b1e3d', fontWeight: 700 }}>Total: <span style={{ color: '#b8860b' }}>₱{parseFloat(total).toFixed(2)}</span></Typography>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <Button className="receipt-close-btn" variant="contained" sx={{ background: '#7b1e3d', color: '#fff', fontWeight: 600, borderRadius: 2, fontSize: 18, flex: 1 }} onClick={() => navigate('/dashboard')}>Close</Button>
                </div>
            </Paper>
        </div>
    );
};

export default Receipt;
