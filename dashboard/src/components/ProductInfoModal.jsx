import { Modal, Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

const ProductInfoModal = ({ open, onClose, product, onAddToCart }) => {
    if (!product) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <img
                    src={`http://localhost:3004/uploads/${product.image}`}
                    alt={product.name}
                    style={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }}
                />
                <Typography variant="h5" fontWeight={700} gutterBottom>{product.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>{product.category}</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>₱ {product.price}</Typography>
                <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'} sx={{ mb: 2 }}>
                    Stock: {product.stock}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    sx={{ mb: 1 }}
                >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button variant="outlined" color="secondary" fullWidth onClick={onClose}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

ProductInfoModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    product: PropTypes.shape({
        image: PropTypes.string,
        name: PropTypes.string,
        category: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
        stock: PropTypes.number,
    }),
    onAddToCart: PropTypes.func.isRequired,
};

export default ProductInfoModal;
