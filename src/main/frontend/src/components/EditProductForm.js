import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import axiosInstance from "../utils/axiosConfig";
import { v4 as uuid } from 'uuid';

import 'bootstrap/dist/css/bootstrap.css';
import { Trash } from 'react-bootstrap-icons';



const EditProductForm = ({updateProducts, productForUpdate}) => {

    const [currentProduct, setCurrentProduct] = useState({
        name: productForUpdate.name,
        price: productForUpdate.price,
        quantity: productForUpdate.quantity,
        description: productForUpdate.description,
        images: productForUpdate.image,
        imageNames: productForUpdate.imageNames,
    });

    const [errors, setErrors] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
    });

    const [imagePreviews, setImagePreviews] = useState(
        currentProduct.images.map((image, index) => ({
            id: uuid(),
            src: image,
            name: currentProduct.imageNames[index],
        }))
    );

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [updatedImagesNames, setUpdatedImagesNames] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (currentProduct.name.trim() === '') {
            newErrors.name = 'Product name is required';
        }

        if (String(currentProduct.price).trim() === '') {
            newErrors.price = 'Price is required.';
        }

        if (String(currentProduct.quantity).trim() === '') {
            newErrors.quantity = 'Quantity is required.';
        }

        if (currentProduct.description.trim() === '') {
            newErrors.description = 'Description is required';
        }

        // if (currentProduct.images.length === 0) {
        //     newErrors.files = 'Please select at least one image'
        // }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setCurrentProduct({...currentProduct, [name]: value});
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('name', currentProduct.name);
        formData.append('price', currentProduct.price);
        formData.append('quantity', currentProduct.quantity);
        formData.append('description', currentProduct.description);
        if (currentProduct.images.length > 0) {
            for (const image of currentProduct.images) {
                formData.append('files', image);
            }
        }

        try {
            console.log(formData.getAll("files"))
            const response = await axiosInstance.put(
                `/products/${productForUpdate.id}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            console.log('Product updated:', response.data);
            setCurrentProduct({
                name: currentProduct.name,
                price: currentProduct.price,
                quantity: currentProduct.quantity,
                description: currentProduct.description,
                images: currentProduct.images,
                imageNames: currentProduct.imageNames,
            });
            setShowSuccessMessage(true);
            updateProducts();
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
        const updatedImagePreviews = [...imagePreviews];

        acceptedFiles.forEach(file => {
            const fileName = file.name;
            if (!productForUpdate.imageNames.includes(fileName.toString()) && !updatedImagesNames.some((image) => image.name === fileName.toString())) {
                const id = uuid();
                updatedImages.push(file);
                updatedImagePreviews.push({id, src: URL.createObjectURL(file), name: fileName.toString()});
                setUpdatedImagesNames([...updatedImagesNames, { id, name: fileName.toString() }]);
            }
        })
        console.log(updatedImages)
        setCurrentProduct({ ...currentProduct, images: updatedImages });
        setImagePreviews(updatedImagePreviews);
    };

    const handleConfirmDelete = async (event, imageForDelete) => {
        event.preventDefault();
        try {
            await axiosInstance.delete(`/products/${productForUpdate.id}/product-image?imageName=${imageForDelete}`);
            const updatedImages = [...currentProduct.images];
            const updatedImagePreviews = imagePreviews.filter((preview) => preview.name !== imageForDelete); // Remove the image preview with the specified id
            const updatedImageNames = updatedImagesNames.filter((imgName) => imgName.name !== imageForDelete);
            setCurrentProduct({ ...currentProduct, images: updatedImages, imageNames: updatedImageNames});
            setImagePreviews(updatedImagePreviews);
            setUpdatedImagesNames(updatedImageNames);
            setSelectedImage(null);
            updateProducts();
            console.log(`Successfully deleted image: ${imageForDelete}`);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <div>
            <form className="form" onSubmit={handleFormSubmit}>
                <div className="mb-2">
                    <label className="label">Product Name</label>
                    <input className={`input--style-4 ${errors.name ? 'is-invalid' : ''}`} type="text" name="name" value={currentProduct.name} onChange={handleInputChange}/>
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-2">
                    <label className={"label"}>Price</label>
                    <input className={`input--style-4 ${errors.price ? 'is-invalid' : ''}`} type="number" name="price" value={currentProduct.price} onChange={handleInputChange}/>
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
                <div className="mb-2">
                    <label className={"label"}>Quantity</label>
                    <input className={`input--style-4 ${errors.quantity ? 'is-invalid' : ''}`} type="number" name="quantity" value={currentProduct.quantity} onChange={handleInputChange}/>
                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                </div>
                <div className="mb-2">
                    <label className={"label"}>Description</label>
                    <textarea className={`text-area ${errors.description ? 'is-invalid' : ''}`} name="description" value={currentProduct.description} onChange={handleInputChange}></textarea>
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
                    {imagePreviews.map((preview) => (
                        <div key={preview.id} className="image-preview-container">
                            <img
                                src={preview.src}
                                alt={`Preview ${preview.id}`}
                                style={{ width: '100%', height: '100%', margin: '5px' }}
                            />
                            <div className="delete-icon" onClick={() => setSelectedImage(preview.name)}>
                                <Trash size={20} />
                            </div>
                            {selectedImage === preview.name && (
                                <div className="delete-confirmation">
                                    <p>Are you sure you want to delete this image?</p>
                                    <button className="btn btn-danger" onClick={(event) => handleConfirmDelete(event, preview.name)}>
                                        Yes
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => setSelectedImage(null)}>
                                        No
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-outline-warning">Update Product</button>
            </form>
            {showSuccessMessage && (
                <div>
                    <p>Successfully updated!</p>
                </div>
            )}
        </div>
    );
}
export default EditProductForm;
