import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button, TextField, Modal } from '@mui/material';
import './AdminDashboard.css';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const AdminDashboard = () => {
    const [products, setProducts] = useState({
        productName: '',
        productPrice: '',
        productDescription: '',
        productImage: null,
        productImageUrl: ''
    });
    const [selectedProduct, setSelectedProduct] = useState({
        _id: '',
        productName: '',
        productPrice: '',
        productDescription: '',
        image: null
    });
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [values, setValues] = useState([]);

    useEffect(() => {
        fetchMenu();
    }, []);

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
            productPrice: product?.price,
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
            productPrice: '',
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
            productPrice: '',
            productDescription: '',
            productImageUrl: '',
            productImage: null
        });
    };

    const handleAddProduct = async () => {
        try {
            const { productName, productPrice, productDescription, productImage, productImageUrl } = products;

            if (!productName || !productPrice || !productDescription || !productImageUrl) return alert('Fields must not be empty!');

            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('productPrice', productPrice);
            formData.append('productDescription', productDescription);
            formData.append('image', productImage);

            const AddProduct = await axios.post('http://192.168.10.24:3004/addproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('From axios: ', AddProduct);
            setProducts({
                productName: '',
                productPrice: '',
                productDescription: '',
                productImageUrl: '',
                productImage: null
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
            await axios.post('http://192.168.10.24:3004/deleteproduct', { productId: selectedProduct._id });
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
            const { _id, productName, productDescription, productPrice } = selectedProduct;

            if (!_id || !productName || !productDescription || !productPrice) {
                return alert('Fields must not be empty!');
            }
            const data = {
                productId: _id,
                productName,
                productPrice,
                productDescription
            };
            const response = await axios.post('http://192.168.10.24:3004/editproduct', data, {
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
        const menu = await axios.get('http://192.168.10.24:3004/getallproducts');
        setValues(menu?.data?.data);
    };

    return (
        <div className="admin-dashboard-container">
            <div className="sidebar">
            <Link to="/AdminDashboard" className="sidebar-link">Manage Products</Link>
            <Link to="/ManageAccount" className="sidebar-link">Manage Account</Link>
            </div>

            <div className="main-content">
                <div className="header">
                    <h2>Admin Dashboard</h2>
                    <Button variant="contained" onClick={handleOpenAddModal}>Add</Button>
                </div>

                <Modal open={modalAddOpen} onClose={handleCloseAddModal}>
                    <div className="view-modal">
                        <h1>Add Product</h1>
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
                                label="Name"
                                value={products.productName}
                                onChange={handleOnChange}
                            />
                            <TextField
                                name="productDescription"
                                label="Description"
                                value={products.productDescription}
                                onChange={handleOnChange}
                            />
                            <TextField
                                name="productPrice"
                                label="Price"
                                type='number'
                                value={products.productPrice}
                                onChange={handleOnChange}
                            />
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

                <Modal open={modalEditOpen} onClose={handleCloseEditModal}>
                    <div className="view-modal">
                        <h1>Edit Product</h1>
                        {selectedProduct && (
                            <div className="modal-forms">
                                <div className="image-container">
                                    {selectedProduct.image ? (
                                        <img src={`http://192.168.10.24:3004/uploads/${selectedProduct.image}`} alt="Product" />
                                    ) : (
                                        <h1>No image</h1>
                                    )}
                                </div>
                                <TextField
                                    name="productName"
                                    label="Product Name"
                                    value={selectedProduct.productName}
                                    onChange={handleEditChange}
                                />
                                <TextField
                                    name="productDescription"
                                    label="Product Description"
                                    value={selectedProduct.productDescription}
                                    onChange={handleEditChange}
                                />
                                <TextField
                                    name="productPrice"
                                    type='number'
                                    label="Product Price"
                                    value={selectedProduct.productPrice}
                                    onChange={handleEditChange}
                                />
                                <div className='btn-add'>
                                    <Button variant="contained" onClick={handleUpdateProduct}>Save Changes</Button>
                                    <Button variant="contained" onClick={handleDeleteProduct} startIcon={<DeleteIcon />}>Delete</Button>
                                    <Button variant="contained" onClick={handleCloseEditModal}>Cancel</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>

                <div className="edit-menu-container">
                    {values?.map((pro) => (
                        <div key={pro?._id} className="card-edit" onClick={() => handleOpenEditModal(pro)}>
                            <div className="image-container">
                                <img src={`http://192.168.10.24:3004/uploads/${pro?.image}`} alt='' />
                            </div>
                            <div className='label'>
                                <h3>{pro?.name}</h3>
                                <h3>₱ {pro?.price}</h3>
                            </div>
                            <div className='description'>
                                <p>{pro?.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
