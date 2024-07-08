import React from 'react';
import { Button, TextField, RadioGroup, FormControlLabel, Radio, Modal, Backdrop, Fade, Paper, Typography } from '@mui/material';
import './Billing.css';
 
const Billing = ({ cart, transactionMode, billingDetails, handleTransactionModeChange, handleBillingChange, handleBillingSubmit }) => {
    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + parseInt(product.price), 0);
    };
 
    return (
        <div className="billing-container">
            <h2>Billing</h2>
            <RadioGroup
                value={transactionMode}
                onChange={handleTransactionModeChange}
            >
                <FormControlLabel value="Union Bank" control={<Radio />} label="Union Bank" />
                <FormControlLabel value="Metro Bank" control={<Radio />} label="Metro Bank" />
            </RadioGroup>
 
            {transactionMode === 'Union Bank' && (
                <div className="bank-account-form">
                    <TextField
                        name="debitAccount"
                        label="Bank Account Number"
                        value={billingDetails?.debitAccount}
                        onChange={handleBillingChange}
                    />
                    <TextField
                        name="creditAccount"
                        label="Bank Routing Number"
                        value={billingDetails?.creditAccount}
                        onChange={handleBillingChange}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
 
                </div>
            )}
            {transactionMode === 'Metro Bank' && (
                <div className="bank-account-form">
                    <TextField
                        name="debitAccount"
                        label="Bank Account Number"
                        value={billingDetails?.debitAccount}
                        onChange={handleBillingChange}
                    />
                    <TextField
                        name="creditAccount"
                        label="Bank Routing Number"
                        value="000000007"
                        onChange={handleBillingChange}
                    />
                </div>
            )}
            <h3>Total: ₱ {getTotalPrice()}</h3>
            <Button variant="contained" onClick={handleBillingSubmit}>Submit Payment</Button>
        </div>
    );
};
 
export default Billing;