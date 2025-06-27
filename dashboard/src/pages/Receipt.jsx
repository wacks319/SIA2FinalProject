import PropTypes from 'prop-types';
import { Button, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import './Receipt.css';

const Receipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [], total = 0, transactionMode = '', billingDetails = {} } = location.state || {};

    return (
        <Paper className="receipt-paper">
            <Typography className="receipt-title" variant="h4" gutterBottom>📚 Bookly Order Receipt</Typography>
            <hr className="receipt-divider" />
            <Typography className="receipt-label" variant="subtitle1">Payment Method: <span style={{ fontWeight: 'normal' }}>{transactionMode}</span></Typography>
            {/*
            {transactionMode === 'Union Bank' && (
                <Typography className="receipt-item" variant="body2">Bank Account: <span style={{ fontWeight: 'normal' }}>{billingDetails.debitAccount}</span></Typography>
            )}
            {transactionMode === 'GCash' && (
                <Typography className="receipt-item" variant="body2">GCash Number: <span style={{ fontWeight: 'normal' }}>{billingDetails.gcashNumber}</span></Typography>
            )}
            */}
            {/* Show comment if provided */}
            {billingDetails.comment && (
                <Typography className="receipt-item" variant="body2">Comment: <span style={{ fontWeight: 'normal' }}>{billingDetails.comment}</span></Typography>
            )}
            <hr className="receipt-divider" />
            <Typography className="receipt-label" variant="subtitle1">Items:</Typography>
            <div style={{ marginBottom: 8 }}>
                {cart.map((item, idx) => (
                    <Typography key={idx} className="receipt-item" variant="body2">
                        <span style={{ fontWeight: 'bold' }}>{item.name}</span> x {item.quantity} @ ₱{item.price} = <span style={{ color: '#b8860b' }}>₱{item.price * item.quantity}</span>
                    </Typography>
                ))}
            </div>
            <hr className="receipt-divider" />
            <Typography className="receipt-total" variant="h6">Total: <span style={{ color: '#4b2e05' }}>₱{total}</span></Typography>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <Button className="receipt-close-btn" variant="contained" onClick={() => navigate('/dashboard')}>Close</Button>
                {/* <Button className="receipt-close-btn" variant="outlined" style={{ background: '#fff', color: '#b8860b', border: '1.5px solid #b8860b' }} onClick={() => navigate('/dashboard')}>Cancel</Button> */}
            </div>
        </Paper>
    );
};

Receipt.propTypes = {
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        })
    ),
    billingDetails: PropTypes.shape({
        // debitAccount: PropTypes.string,
        // gcashNumber: PropTypes.string,
        comment: PropTypes.string,
    }),
    transactionMode: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Receipt;
