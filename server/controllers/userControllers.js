const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 
const JWT_SECRET = 'your_jwt_secret_key';
 
// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, userRole } = req.body;
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const user = new User({
      username,
      email,
      password: hashedPassword,
      userRole // Optionally include user role during user creation
    });
 
    const savedUser = await user.save();
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};
 
// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving users', error });
  }
};
 
// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving user', error });
  }
};
 
// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, userRole } = req.body;
 
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    user.username = username || user.username;
    user.email = email || user.email;
    user.userRole = userRole || user.userRole; // Update userRole if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
 
    const updatedUser = await user.save();
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
};
 

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id} = req.params
    if (user = await User.findByIdAndDelete(id)) {
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { loginID, password } = req.body;

    // Find the user by either email or username
    const user = await User.findOne({
      $or: [{ email: loginID }, { username: loginID }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, userRole: user.userRole });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

 