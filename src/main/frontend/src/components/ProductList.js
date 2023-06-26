import React, {useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Modal} from "react-bootstrap";
import ProductDetails from "./ProductDetails";
import EditProductForm from "./EditProductForm";

const ProductList = ({productList, updateProducts}) => {

    const [selectedEditProduct, setSelectedEditProduct] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [searchInput, setSearchInput] = useState('');


    const handleOpenProduct = (productId) => {
        setSelectedProductId(productId);
    };

    const handleEditProduct = (product) => {
        console.log(product.imageNames);
        setSelectedEditProduct(product);
    }

    const handleDeleteProduct = async (productId) => {
        try {
            await axiosInstance.delete(`/products/${productId}`);
            console.log("Product was successfully deleted!")
            updateProducts();
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        updateProducts(searchInput);
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-center mb-2">
                <form className="d-flex align-items-center justify-content-center mb-2" role="search" onSubmit={handleSearchSubmit}>
                    <input className="form-control me-2" type="search" placeholder="Search..."
                           aria-label="Search" value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)}/>
                    <button className="btn btn-secondary mb-0" type="submit">Search</button>
                </form>
            </div>
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                <tr>
                    <th scope="col">№</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Description</th>
                    <th scope="col">Operations</th>
                </tr>
                </thead>
                <tbody>
                {productList.map((product, index) => {
                    return (
                        <tr key={index}>
                            <th scope="row">{index+1}</th>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.description.substr(0,30)} {product.description.length > 30 ? '...' : ''}</td>
                            <td>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-outline-info fixed-width-button mb-0" onClick={() => handleOpenProduct(product.id)}>View</button>
                                    <button type="button" className="btn btn-outline-warning fixed-width-button mb-0" onClick={() => handleEditProduct(product)} >Edit</button>
                                    <button type="button" className="btn btn-outline-danger fixed-width-button mb-0" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
                {selectedProductId && (
                    <ProductDetails
                        productId={selectedProductId}
                        onClose={() => setSelectedProductId(null)}
                    />
                )}
                {selectedEditProduct && (
                    <Modal show={true} onHide={() => setSelectedEditProduct(null)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <EditProductForm
                                updateProducts={updateProducts}
                                productForUpdate={selectedEditProduct}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setSelectedEditProduct(null)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </table>
        </div>
    );
};


export default ProductList;