import React, {useState} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import AddProductForm from "./AddProductForm";
import { Modal, Button } from 'react-bootstrap';


function NavBar({updateProducts}) {
    const [showModal, setShowModal] = useState(false);

    const [searchInput, setSearchInput] = useState('');

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        updateProducts(searchInput);
    };

    return (
        <nav className="navbar navbar-expand" style={{backgroundColor: "#274C5B"}}>
            <div className="container-fluid">
                <a className="navbar-brand" style={{color: "#E4E6E7FF"}} href="#">Admin Page</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" style={{color: "#E4E6E7FF"}} href="#" onClick={handleOpenModal}>Create</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" style={{color: "#E4E6E7FF"}} href="#">Orders</a>
                        </li>
                    </ul>
                    <form className="d-flex align-items-center justify-content-center" role="search" onSubmit={handleSearchSubmit}>
                            <input className="form-control me-2" type="search" placeholder="Search"
                                   aria-label="Search" value={searchInput}
                                   onChange={(e) => setSearchInput(e.target.value)}/>
                            <button className="btn btn-outline-light mb-0" type="submit">Search</button>
                    </form>
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