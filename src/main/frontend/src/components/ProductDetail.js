import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { Modal, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../App.css'



const ProductDetail = ({ productId, onClose }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Fetch product details using the productId
        axiosInstance.get(`/products/${productId}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [productId]);

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Product Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {product ? (
                    <div className="card w-100 card-bg">
                        <div className="card-header">
                            <h5 className="card-title">{product.name}</h5>
                            <div className="text-body-secondary">product code</div>
                        </div>
                        <div id="carousel" className="carousel slide mt-2">
                            <div className="carousel-inner">
                                    {product.image.map((img, index) => {
                                        return (
                                            index === 0
                                            ? <div className="carousel-item active" key={index}>
                                                  <div key={index} className="d-flex justify-content-center align-items-center carousel-img-container ">
                                                    <img src={img}
                                                      className="d-block w-100 carousel-image"
                                                      alt="index"
                                                    />
                                                  </div>
                                            </div>
                                            : <div className="carousel-item" key={index}>
                                                    <div className="d-flex justify-content-center align-items-center carousel-img-container ">
                                                        <img src={img}
                                                             className="d-block w-100 carousel-image"
                                                             alt="index"
                                                        />
                                                    </div>
                                            </div>
                                        )
                                    } )}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carousel"
                                    data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carousel"
                                    data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                        <div className="card-body">
                            <h6 className="card-subtitle">Price:</h6>
                            <p className="card-text">{product.price}</p>
                            <h6 className="card-subtitle">Quantity:</h6>
                            <p className="card-text">{product.quantity}</p>
                            <h6 className="card-subtitle">Description:</h6>
                            <p className="card-text">{product.description}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetail;
