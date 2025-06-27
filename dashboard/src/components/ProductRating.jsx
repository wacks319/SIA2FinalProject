import PropTypes from 'prop-types';
import { Rating } from '@mui/material';

const ProductRating = ({ value, onChange }) => {
    return (
        <Rating
            name="product-rating-inline"
            value={value}
            onChange={onChange}
            size="small"
            sx={{ verticalAlign: 'middle' }}
        />
    );
};

ProductRating.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ProductRating;
