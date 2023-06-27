import React, {useEffect, useState} from "react";
import {MdAddShoppingCart, MdArrowDownward, MdArrowUpward, MdDeleteForever} from "react-icons/md";
import {BiTimeFive} from "react-icons/bi";
import {IoIosAirplane} from "react-icons/io";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/OrderManager.css';
import Tooltip from '@mui/material/Tooltip';

import OrderDetails from './OrderDetails';

const OrderManager = () => {
    const [filter, setFilter] = useState('Created');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [selectedOrder, setSelectedOrder] = useState(null);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders');
                setOrders(response.data);
            } catch (e) {
                console.error('Error fetching orders: ', e);
            }
        };

        fetchOrders().catch((err) => console.error("Error in the fetchOrders: ", err));

    }, []);

    useEffect(() => {
        handleFilterChange(filter);
    }, [orders, filter]);

    const updateOrderStatus = async (orderId, currentStatus, changeTo) => {
        let newStatus = '';
        switch (currentStatus) {
            case 'CREATED' :
                changeTo === "down"
                ? newStatus = "IN_PROGRESS"
                : newStatus = "CANCELLED"
                break;
            case 'IN_PROGRESS' :
                if(changeTo === 'down'){
                    newStatus = "SHIPPED"
                } else if(changeTo === 'up'){
                    newStatus = "CREATED"
                } else {
                    newStatus = "CANCELLED"
                }
                break;
            case 'SHIPPED' :
                changeTo === "up"
                    ? newStatus = "IN_PROGRESS"
                    : newStatus = "CANCELLED"
                break;
            case 'CANCELLED' :
                newStatus = "CREATED"
                break;
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/orders/${orderId}`, null, {
                params: {
                    newStatus: newStatus
                }
            });
            // Update orders state
            setOrders(prevOrders => {
                return prevOrders.map(order => {
                    if (order.id === orderId) {
                        return {...order, status: newStatus};
                    }
                    return order;
                });
            });

            // Update filteredOrders state
            setFilteredOrders(prevFilteredOrders => {
                return prevFilteredOrders.filter(order => order.id !== orderId);
            });

            // Check if the current page becomes empty
            const remainingItems = currentItems.filter(item => item.id !== orderId);
            if (remainingItems.length === 0 && currentPage > 1) {
                // Navigate to the previous page
                setCurrentPage(currentPage - 1);
            }

        } catch (e) {
            console.error('Error fetching orders: ', e);
        }
    }

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
        if (orders.length > 0) {
            const filteredOrders = orders.filter(order => order.status === selectedFilter.toUpperCase());
            setFilteredOrders(filteredOrders);
        } else {
            setFilteredOrders([]);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    function handleOpenOrder(order) {
        setSelectedOrder(order);
    }

    return (
        <div>
            <div className="d-flex mt-5">
                <div className="col-2 ">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row">
                            <div
                                className={`filter-option ${filter === 'Created' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('Created')}
                            >
                                <MdAddShoppingCart size={34} className="filter-icon" />
                            </div>
                            <span className={`filter-text ${filter === 'Created' ? 'active' : ''}`}>New Orders</span>
                        </div>

                        <div className="d-flex flex-row">
                            <div
                                className={`filter-option ${filter === 'In_Progress' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('In_Progress')}
                            >
                                <BiTimeFive size={34} className="filter-icon" />
                            </div>
                            <span className={`filter-text ${filter === 'In_Progress' ? 'active' : ''}`}>In Progress</span>
                        </div>

                        <div className="d-flex flex-row">
                            <div
                                className={`filter-option ${filter === 'Shipped' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('Shipped')}
                            >
                                <IoIosAirplane size={34} className="filter-icon" />
                            </div>
                            <span className={`filter-text ${filter === 'Shipped' ? 'active' : ''}`}>Was Shipped</span>
                        </div>

                        <div className="d-flex flex-row">
                            <div
                                className={`filter-option ${filter === 'Cancelled' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('Cancelled')}
                            >
                                <MdDeleteForever size={34} className="filter-icon" />
                            </div>
                            <span className={`filter-text ${filter === 'Cancelled' ? 'active' : ''}`}>Cancelled Orders</span>
                        </div>

                    </div>
                </div>
                {/* Display orders based on selected filter */}
                <div className="container">
                    <div className="row">
                        {currentItems.map(order => (
                            <div key={order.id} className="col-md-3 mb-3">
                                <div className="card">
                                    <div className="card-body cursor-pointer" onClick={() => handleOpenOrder(order)}>
                                        <h5 className="card-title">№{order.id}</h5>
                                        Created at:
                                        <p className="card-text">{order.created}</p>
                                    </div>
                                    <div className="card-footer">
                                        <div className="row">
                                            {order.status !== "CANCELLED" &&
                                                <Tooltip title="Cancel this order">
                                                    <div
                                                        className={`change-status-icon col-md-4`}
                                                        onClick={() => updateOrderStatus(order.id, order.status, "cancel")}
                                                    >
                                                        <MdDeleteForever size={24} className="filter-icon" />
                                                    </div>
                                                </Tooltip>
                                            }

                                            {order.status !== "CREATED" &&
                                                <Tooltip title={order.status === "SHIPPED" ? "Return to in progress" :  "Return to the new orders"}>
                                                    <div
                                                        className={`change-status-icon col-md-4`}
                                                        onClick={() => updateOrderStatus(order.id, order.status, 'up')}
                                                    >
                                                        <MdArrowUpward size={24} className="filter-icon" />
                                                    </div>
                                                </Tooltip>
                                            }

                                            {(order.status !== "SHIPPED" && order.status !== "CANCELLED") &&
                                                <Tooltip title={order.status === "CREATED" ? "Take the order into the working" : "Order was shipped"}>
                                                    <div
                                                        className={`change-status-icon col-md-4`}
                                                        onClick={() => updateOrderStatus(order.id, order.status, 'down')}
                                                    >
                                                        <MdArrowDownward size={24} className="filter-icon" />
                                                    </div>
                                                </Tooltip>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination d-flex align-items-center justify-content-center mb-2">
                        {filteredOrders.length > itemsPerPage && (
                            <ul className="pagination pagination-grey">
                                {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, index) => index + 1).map((pageNumber) => (
                                    <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => paginate(pageNumber)}>
                                            {pageNumber}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {selectedOrder && (
                        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManager;
