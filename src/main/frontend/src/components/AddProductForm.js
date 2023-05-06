import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';


const AddProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        files: [],
    });

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setProduct({...product, [name]: value});
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('description', product.description);
        for (const image of product.images) {
            formData.append('files', image);
        }

        console.log(formData.get("files").type)
        try {
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
                images: [],
            });
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleImageDrop = (acceptedFiles) => {
        const updatedImages = [];
        acceptedFiles.forEach(file => {
            updatedImages.push(file);
        })
        console.log(updatedImages)
        setProduct({ ...product, images: updatedImages });
    };

    return (
        <div className={"addProductForm"}>
            <h1>Add New Product</h1>
            <form className={"form"} onSubmit={handleFormSubmit}>
                <div className={"input"}>
                    <label className={"label"}>Product Name</label>
                    <input className={"input--style-4"} type="text" name="name" value={product.name} onChange={handleInputChange}/>
                </div>
                <div className={"input-group"}>
                    <label className={"label"}>Price</label>
                    <input className={"input--style-4"} type="number" name="price" value={product.price} onChange={handleInputChange}/>
                </div>
                <div className={"input-group"}>
                    <label className={"label"}>Quantity</label>
                    <input className={"input--style-4"} type="number" name="quantity" value={product.quantity} onChange={handleInputChange}/>
                </div>
                <div className={"input-group"}>
                    <label className={"label"}>Description</label>
                    <textarea className={"text-area"} name="description" value={product.description} onChange={handleInputChange}></textarea>
                </div>
                <Dropzone onDrop={handleImageDrop}>
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()} className={"dropzone"}>
                            <input {...getInputProps()} />
                            <p>Drag and drop product images here, or click to select images</p>
                        </div>
                    )}
                </Dropzone>
                <button className={"btn"} type="submit">Create Product</button>
            </form>
        </div>
    );
}
    export default AddProductForm;
