import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { isNumeric } from 'validator';

import 'bootstrap/dist/css/bootstrap.css';



const AddProductForm = ({updateProducts}) => {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        files: [],
    });

    const [errors, setErrors] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        files: '',
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const validateForm = () => {
        const newErrors = {};

        if (product.name.trim() === '') {
            newErrors.name = 'Product name is required';
        }

        if (product.price.trim() === '') {
            newErrors.price = 'Price is required.';
        } else if (!isNumeric(product.price)) {
            newErrors.price = 'Price must be a number';
        }

        if (product.quantity.trim() === '') {
            newErrors.quantity = 'Quantity is required.';
        } else if (!isNumeric(product.quantity)) {
            newErrors.quantity = 'Quantity must be a number';
        }

        if (product.description.trim() === '') {
            newErrors.description = 'Description is required';
        }

        if (product.files.length === 0) {
            newErrors.files = 'Please select at least one image'
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setProduct({...product, [name]: value});
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('description', product.description);
        if (product.files.length > 0) {
            for (const image of product.files) {
                formData.append('files', image);
            }
            console.log(formData.get("files").type)
        }

        try {
            console.log(formData.getAll("files"))
            const response = await axios.post(
                'http://localhost:8080/api/products/add-product',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            console.log('New product created:', response.data);
            setProduct({
                name: '',
                price: '',
                quantity: '',
                description: '',
                files: [],
            });
            updateProducts();
            setImagePreviews([]);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleImageDrop = (acceptedFiles) => {
        if (acceptedFiles.length === 0) {
            setErrors({ ...errors, files: 'Please select at least one image.' });
            return;
        }
        const updatedImages = [];
        const updatedImagePreviews = [];

        acceptedFiles.forEach(file => {
            updatedImages.push(file);
            updatedImagePreviews.push(URL.createObjectURL(file));
        })
        console.log(updatedImages)
        setProduct({ ...product, files: updatedImages });
        setImagePreviews(updatedImagePreviews);

    };

    return (
        <div>
            <form className="form" onSubmit={handleFormSubmit}>
                <div className="mb-2">
                    <label className="label">Product Name</label>
                    <input className={`input--style-4 ${errors.name ? 'is-invalid' : ''}`} type="text" name="name" value={product.name} onChange={handleInputChange}/>
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-2">
                    <label className={"label"}>Price</label>
                    <input className={`input--style-4 ${errors.price ? 'is-invalid' : ''}`} type="number" name="price" value={product.price} onChange={handleInputChange}/>
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
                <div className="mb-2">
                    <label className={"label"}>Quantity</label>
                    <input className={`input--style-4 ${errors.quantity ? 'is-invalid' : ''}`} type="number" name="quantity" value={product.quantity} onChange={handleInputChange}/>
                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                </div>
                <div className="mb-2">
                    <label className={"label"}>Description</label>
                    <textarea className={`text-area ${errors.description ? 'is-invalid' : ''}`} name="description" value={product.description} onChange={handleInputChange}></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
                <div className={"mb-2"}>
                    <Dropzone onDrop={handleImageDrop}>
                        {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()} className={`dropzone ${errors.files ? 'is-invalid' : '' } `}>
                                <input {...getInputProps()} />
                                <p>Drag and drop product images here, or click to select images</p>
                            </div>
                        )}
                    </Dropzone>
                    {errors.files && <div className="invalid-feedback">{errors.files}</div>}
                </div>
                <div>
                    {imagePreviews.map((preview, index) => (
                        <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index}`}
                            style={{ width: '100px', height: '100px', margin: '5px' }}
                        />
                    ))}
                </div>
                <button type="submit" className="btn btn-outline-warning">Create Product</button>
            </form>
        </div>
    );
}
    export default AddProductForm;
