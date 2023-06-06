import React, {useState} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Modal} from "react-bootstrap";
import ProductDetail from "./ProductDetail";
import EditProductForm from "./EditProductForm";

const ProductList = ({productList, updateProducts}) => {

    const [selectedEditProduct, setSelectedEditProduct] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const handleOpenProduct = (productId) => {
        setSelectedProductId(productId);
    };

    const handleEditProduct = (product) => {
        console.log(product.imageNames);
        setSelectedEditProduct(product);
    }

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${productId}`);
            console.log("Product was successfully deleted!")
            updateProducts();
        } catch (error) {
            console.log(error);
        }
    }

    return (
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
                                    <button type="button" className="btn btn-outline-info mb-0" onClick={() => handleOpenProduct(product.id)}>View</button>
                                    <button type="button" className="btn btn-outline-warning mb-0" onClick={() => handleEditProduct(product)} >Edit</button>
                                    <button type="button" className="btn btn-outline-danger mb-0" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            {selectedProductId && (
                <ProductDetail
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
    );
};


export default ProductList;