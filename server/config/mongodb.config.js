// // MongoDB configuration for cloud (Atlas) and local fallback
// const mongoose = require('mongoose');
// require('dotenv').config();

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://finalsia102:cwP3NuzA2cE6oYdc@ryan.vsinll7.mongodb.net/';

// const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected:', MONGODB_URI);
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
