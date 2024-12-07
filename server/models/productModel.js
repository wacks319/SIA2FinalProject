const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    // price: {
    //     type: String,
    //     required: true
    // },

    category: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    // stock: {
    //     type: Number,
    //     required: false
    // }
});

module.exports = mongoose.model('Products', productSchema);

