import ProductList from "../components/ProductList";
import NavBar from "../components/NavBar";
import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import OrderManager from "../components/OrderManager";


const AdminPage = () => {

    const [activeSection, setActiveSection] = useState('Products');
    const [productList, setProductList] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);


    const fetchProductList = (searchQuery) => {
        if (searchQuery === undefined){
            searchQuery = '';
        }
        axios.get(`http://localhost:8080/api/products?search=${searchQuery}`).then(res => {
            console.log(res);
            setProductList(res.data);
        }).catch((error) => {
            console.error('Error occurred while fetching product list:', error);
        });
    }

    useEffect(() => {
        if (initialLoad) {
            fetchProductList();
            setInitialLoad(false);
        }
    }, [initialLoad])


    const updateProductList = (searchQuery) => {
        fetchProductList(searchQuery);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === 'Products') {
            updateProductList();
        } else if (section === 'Orders') {
            // updateOrderList();
        }
    };

    return (
        <div>
            <NavBar updateProducts={updateProductList} />
            <div className="container mt-3">
                <div className="row">
                    <div className="col">
                        <div
                            className={`card ${activeSection === 'Products' ? 'bg-secondary text-white' : ''}`}
                            onClick={() => handleSectionChange('Products')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">Products</h5>
                                <p className="card-text">View and manage products</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div
                            className={`card ${activeSection === 'Orders' ? 'bg-secondary text-white' : ''}`}
                            onClick={() => handleSectionChange('Orders')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">Orders</h5>
                                <p className="card-text">View and manage orders</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div
                            className={`card ${activeSection === 'Users' ? 'bg-secondary text-white' : ''}`}
                            onClick={() => handleSectionChange('Users')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">User Management</h5>
                                <p className="card-text">View and manage users</p>
                            </div>
                        </div>
                    </div>
                    {/* Add more cards for additional sections */}
                </div>
            </div>
            <div className="container mt-3">
                {activeSection === 'Products' && <ProductList productList={productList} updateProducts={updateProductList} />}
                {activeSection === 'Orders' && <OrderManager/>}
                {/* Add more sections and corresponding components */}
            </div>
        </div>
    );
};

export default AdminPage;