import PropTypes from 'prop-types';
import { Button, Typography, Paper } from '@mui/material';
import './Receipt.css';

const Receipt = ({ cart, billingDetails, transactionMode, total, onClose }) => {
    return (
        <Paper className="receipt-paper">
            <Typography className="receipt-title" variant="h4" gutterBottom>📚 Bookly Order Receipt</Typography>
            <hr className="receipt-divider" />
            <Typography className="receipt-label" variant="subtitle1">Payment Method: <span style={{ fontWeight: 'normal' }}>{transactionMode}</span></Typography>
            {transactionMode === 'Union Bank' && (
                <Typography className="receipt-item" variant="body2">Bank Account: <span style={{ fontWeight: 'normal' }}>{billingDetails.debitAccount}</span></Typography>
            )}
            {transactionMode === 'GCash' && (
                <Typography className="receipt-item" variant="body2">GCash Number: <span style={{ fontWeight: 'normal' }}>{billingDetails.gcashNumber}</span></Typography>
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
            <Button className="receipt-close-btn" variant="contained" onClick={onClose}>Close</Button>
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
    ).isRequired,
    billingDetails: PropTypes.shape({
        debitAccount: PropTypes.string,
        gcashNumber: PropTypes.string
    }).isRequired,
    transactionMode: PropTypes.string.isRequired,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClose: PropTypes.func.isRequired
};

export default Receipt;
