import React, {useState} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import AddProductForm from "./AddProductForm";
import { Modal, Button } from 'react-bootstrap';
import {Link} from "react-router-dom";


function NavBar({updateProducts}) {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    return (
        <nav className="navbar navbar-expand navbar-custom" style={{backgroundColor: "#274C5B"}}>
            <div className="container-fluid">
                <Link className="navbar-brand" style={{ color: '#E4E6E7FF' }} to="/admin">
                    Admin Page
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" style={{ color: '#E4E6E7FF' }} to="/">
                                Entry Page
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" style={{ color: '#E4E6E7FF', backgroundColor: 'transparent',
                                border: 'none' }} onClick={handleOpenModal}>
                                New product
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddProductForm updateProducts={updateProducts}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    {/* Additional buttons or actions */}
                </Modal.Footer>
            </Modal>
        </nav>
    );
}

export default NavBar;