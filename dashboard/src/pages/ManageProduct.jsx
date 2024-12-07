import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    TextField,
    Modal,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import axios from 'axios';
import './ManageProduct.css';

const ManageProduct = () => {
    const [products, setProducts] = useState({
        productName: '',
        productDescription: '',
        productImage: null,
        productCategory: '',
        productImageUrl: '',
    });
    const [selectedProduct, setSelectedProduct] = useState({
        _id: '',
        productName: '',
        productDescription: '',
        productCategory: '',
        image: null
    });
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [values, setValues] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchMenu();
    }, []);

    // const categories = ['All', 'Books', 'Arts & Crafts', 'Coloring Supplies', 'Filling Supplies', 'Paper Supplies', 'Writing Supplies', 'School & Office Essentials'];
    const categories = ['All', 'Anime', 'Action', 'Horror'];
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredValues = selectedCategory === 'All' ? values : values.filter(product => product.category === selectedCategory);

    const handleOpenAddModal = () => {
        setModalAddOpen(true);
    };

    const handleCloseAddModal = () => {
        setModalAddOpen(false);
    };

    const handleOpenEditModal = (product) => {
        setSelectedProduct({
            _id: product?._id,
            productName: product?.name,
            productDescription: product?.description,
            productCategory: product?.category,
            image: product?.image
        });
        setModalEditOpen(true);
    };

    const handleCloseEditModal = () => {
        setModalEditOpen(false);
        setSelectedProduct({
            _id: '',
            productName: '',
            productDescription: '',
            productCategory: '',
            image: null
        });
    };

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'productImage' && files && files[0]) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);

            setProducts((prev) => ({
                ...prev,
                productImage: file,
                productImageUrl: imageUrl
            }));
        } else {
            setProducts((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCancel = () => {
        setModalAddOpen(false);
        setProducts({
            productName: '',
            productDescription: '',
            productImageUrl: '',
            productImage: null,
            productCategory: ''
        });
    };

    const handleAddProduct = async () => {
        try {
            const { productName, productDescription, productImage, productCategory } = products;

            if (!productName || !productDescription || !productImage || !productCategory) {
                return alert('Fields must not be empty!');
            }

            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('productDescription', productDescription);
            formData.append('image', productImage);
            formData.append('category', productCategory);

            await axios.post('http://localhost:3004/addproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProducts({
                productName: '',
                productDescription: '',
                productImageUrl: '',
                productImage: null,
                productCategory: ''
            });
            fetchMenu();
        } catch (error) {
            alert('Error adding product!', error);
        } finally {
            setModalAddOpen(false);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.post('http://localhost:3004/deleteproduct', { productId: selectedProduct._id });
            setValues((prev) => prev.filter((product) => product._id !== selectedProduct._id));
            handleCloseEditModal();
        } catch (error) {
            alert('Error deleting product!', error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProduct = async () => {
        try {
            const { _id, productName, productDescription, productCategory } = selectedProduct;

            if (!_id || !productName || !productDescription || !productCategory) {
                return alert('Fields must not be empty!');
            }

            const data = {
                productId: _id,
                productName,
                productDescription,
                category: productCategory
            };

            const response = await axios.post('http://localhost:3004/editproduct', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                handleCloseEditModal();
                fetchMenu();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product!');
        }
    };

    const fetchMenu = async () => {
        const menu = await axios.get('http://localhost:3004/getallproducts');
        setValues(menu?.data?.data);
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <Link to="/ManageProduct" className="sidebar-link">
                    <DashboardIcon sx={{ marginRight: '10px' }} />
                    Manage Books
                </Link>
                <Link to="/ManageAccount" className="sidebar-link">
                    <AccountBoxIcon sx={{ marginRight: '10px' }} />
                    Manage Account
                </Link>
                {/* <Link to="/BackupandRestore" className="sidebar-link sidebar-link">
                    <ExitToAppIcon sx={{ marginRight: '10px' }} />
                    Backup and Restore
                </Link> */}
                <Link to="/" className="sidebar-link logout-link">
                    <ExitToAppIcon sx={{ marginRight: '10px' }} />
                    Logout
                </Link>
            </div>

            {/* Header */}
            <div className="header">
                <h2>Manage Books</h2>
                <Button variant="contained" onClick={handleOpenAddModal}>Add</Button>
            </div>

            {/* Category Filter */}
            <div className="category-list">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'contained' : 'outlined'}
                        onClick={() => handleCategoryChange(category)}
                        sx={{ marginRight: '10px', marginBottom: '10px' }}
                        className="category-button"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Add Product Modal */}
            <Modal open={modalAddOpen} onClose={handleCloseAddModal}>
                <div className="view-modal">
                    <h1>Add</h1>
                    <div className="modal-forms">
                        <div className="image-container">
                            {products.productImageUrl ? (
                                <img src={products.productImageUrl} alt="Product" />
                            ) : (
                                <h1>No image</h1>
                            )}
                        </div>
                        <TextField
                            name="productName"
                            label="Title"
                            value={products.productName}
                            onChange={handleOnChange}
                        />
                        <TextField
                            name="productDescription"
                            label="Description"
                            value={products.productDescription}
                            onChange={handleOnChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="productCategory"
                                value={products.productCategory}
                                onChange={handleOnChange}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <input
                            name="productImage"
                            type="file"
                            accept="image/*"
                            onChange={handleOnChange}
                        />
                        <div className='btn-add'>
                            <Button variant="contained" onClick={handleAddProduct}>Add</Button>
                            <Button variant="contained" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Product Modal */}
            <Modal open={modalEditOpen} onClose={handleCloseEditModal}>
                <div className="view-modal">
                    <h1>Edit</h1>
                    {selectedProduct && (
                        <div className="modal-forms">
                            <div className="image-container">
                                {selectedProduct.image ? (
                                    <img src={`http://localhost:3004/uploads/${selectedProduct.image}`} alt="Product" />
                                ) : (
                                    <h1>No image</h1>
                                )}
                            </div>
                            <TextField
                                name="productName"
                                label="Book Name"
                                value={selectedProduct.productName}
                                onChange={handleEditChange}
                            />
                            <TextField
                                name="productDescription"
                                label="Book Description"
                                value={selectedProduct.productDescription}
                                onChange={handleEditChange}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="productCategory"
                                    value={selectedProduct.productCategory}
                                    onChange={handleEditChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>{category}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div className='btn-add'>
                                <Button variant="contained" onClick={handleUpdateProduct}>Save Changes</Button>
                                <Button variant="contained" onClick={handleDeleteProduct} startIcon={<DeleteIcon />}>Delete</Button>
                                <Button variant="contained" onClick={handleCloseEditModal}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Product Cards */}
            <div className="edit-menu-container">
                {filteredValues?.map((pro) => (
                    <div key={pro?._id} className="card-edit" onClick={() => handleOpenEditModal(pro)}>
                        <div className="image-container">
                            <img src={`http://localhost:3004/uploads/${pro?.image}`} alt='' />
                        </div>
                        <div className='label'>
                            <h3>{pro?.name}</h3>
                        </div>
                        <div className='description'>
                            <p>{pro?.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageProduct;
