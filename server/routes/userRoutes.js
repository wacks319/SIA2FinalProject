const express = require('express');
const userController = require('../controllers/userControllers.js');  // Correct path to the controller

 
const router = express.Router();
 
// Create a new user
router.post('/users', userController.createUser);
 
// Get all users
router.get('/users', userController.getUsers);
 
// Get a user by ID
router.get('/users/:id', userController.getUserById);
 
// Update a user by ID
router.put('/users/:id', userController.updateUser);
 
// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);
 
// User login
router.post('/login', userController.loginUser);
 
module.exports = router;