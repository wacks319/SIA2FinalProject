import React from 'react';
import {
    Button,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Modal,
    Backdrop,
    Fade,
    Paper,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import './Billing.css';

const Billing = ({
    cart,
    transactionMode,
    billingDetails,
    handleTransactionModeChange,
    handleBillingChange,
    handleBillingSubmit
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + parseInt(product.price, 10), 0);
    };

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    return (
        <div className="billing-container">
            <h2>Billing</h2>
            <RadioGroup value={transactionMode} onChange={handleTransactionModeChange} row>
                <FormControlLabel value="Union Bank" control={<Radio />} label="Union Bank" />
                <FormControlLabel value="GCash" control={<Radio />} label="GCash" />
            </RadioGroup>

            {transactionMode === 'Union Bank' && (
                <div className="bank-account-form">
                    <TextField
                        name="debitAccount"
                        label="Bank Account Number"
                        value={billingDetails?.debitAccount}
                        onChange={handleBillingChange}
                    />
                </div>
            )}
            {transactionMode === 'GCash' && (
                <div className="gcash-form">
                    <TextField
                        name="gcashNumber"
                        label="GCash Number"
                        value={billingDetails?.gcashNumber || ''}
                        onChange={handleBillingChange}
                    />
                </div>
            )}

            <h3>Total: ₱ {getTotalPrice()}</h3>
            <Button variant="contained" onClick={handleBillingSubmit}>
                Submit Payment
            </Button>

            {/* Just to use Modal, Backdrop, Fade, Typography, Paper */}
            <Button onClick={handleOpen} style={{ marginTop: '1rem' }}>Open Info</Button>
            <Modal
                open={modalOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={modalOpen}>
                    <Paper className="modal-paper" sx={{ padding: 3, margin: 'auto', maxWidth: 400, mt: 10 }}>
                        <Typography variant="h6">Billing Notice</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Please ensure all details are accurate before submitting.
                        </Typography>
                        <Button onClick={handleClose} sx={{ mt: 2 }} variant="outlined">Close</Button>
                    </Paper>
                </Fade>
            </Modal>
        </div>
    );
};

Billing.propTypes = {
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        })
    ).isRequired,
    transactionMode: PropTypes.string.isRequired,
    billingDetails: PropTypes.shape({
        debitAccount: PropTypes.string,
        gcashNumber: PropTypes.string
    }),
    handleTransactionModeChange: PropTypes.func.isRequired,
    handleBillingChange: PropTypes.func.isRequired,
    handleBillingSubmit: PropTypes.func.isRequired
};

export default Billing;
