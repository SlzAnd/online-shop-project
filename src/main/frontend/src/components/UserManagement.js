import axiosInstance from "../utils/axiosConfig";
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/OrderManager.css';
import React, {useEffect, useState} from "react";
import Tooltip from '@mui/material/Tooltip';
import {AiOutlineUserAdd, AiOutlineUserDelete} from "react-icons/ai";
import {FaUserPlus, FaUserEdit, FaUserMinus, FaUserCog} from "react-icons/fa";
import '../styles/UserManagement.css';




const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState('All');
    const [filteredUsers, setFilteredUsers] = useState([]);


    useEffect(() => {
        fetchUsers().catch((err) => console.error("Error in the fetchUsers: ", err));
    }, []);

    useEffect(() => {
        handleFilterChange(filter);
    }, [users, filter]);

    const fetchUsers = async (searchQuery) => {
        if (searchQuery === undefined){
            searchQuery = '';
        }
        try {
            const response = await axiosInstance.get(`/users?search=${searchQuery}`);
            setUsers(response.data);
        } catch (e) {
            console.error('Error fetching users: ', e);
        }
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        await fetchUsers(searchInput);
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        if (event.target.value.trim() === '') {
            fetchUsers().catch((err) => console.error("Error in the fetchUsers: ", err));
        }
    };

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
        if (users.length > 0) {
            if(selectedFilter === "All") {
                setFilteredUsers(users);
            } else {
                const filteredUsers = users.filter(user => user.role === selectedFilter.toUpperCase());
                setFilteredUsers(filteredUsers);
            }
        } else {
            setFilteredUsers([]);
        }
    };


    return (
        <div>
            <div className="d-flex align-items-center justify-content-center mb-2">
                <form className="d-flex align-items-center justify-content-center mb-2" role="search" onSubmit={handleSearchSubmit}>
                    <input className="form-control me-2" type="search" placeholder="Search..."
                           aria-label="Search" value={searchInput}
                           onChange={(e) => handleSearchInputChange(e)}/>
                    <Tooltip title="Search by name, email or phone number">
                        <button className="btn btn-secondary mb-0" type="submit">Search</button>
                    </Tooltip>
                </form>
            </div>
            <div className="d-flex align-items-center justify-content-start mb-2">
                <Tooltip title="Create new administrator">
                    <div className="user-management-option">
                        <FaUserPlus size={34} className="user-management-icon" />
                    </div>
                </Tooltip>
                <ul className="pagination ms-4 mb-0">
                    <li className="page-item"><a className={`page-link ${filter === 'All' ? 'active' : ''}`} onClick={() => handleFilterChange('All')}>All</a></li>
                    <li className="page-item"><a className={`page-link ${filter === 'ADMIN' ? 'active' : ''}`} onClick={() => handleFilterChange('ADMIN')}>Management</a></li>
                    <li className="page-item"><a className={`page-link ${filter === 'USER' ? 'active' : ''}`} onClick={() => handleFilterChange('USER')}>Customers</a></li>
                </ul>
            </div>
            <table className="table table-light">
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td>
                                <div>
                                    {user.firstName} {user.lastName}
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center justify-content-start mb-0">
                                    <div className="mb-0">
                                        {user.role}
                                    </div>
                                    <Tooltip title="Change role">
                                        <div className="icon-button mb-0">
                                            <FaUserEdit size={24} className="user-management-icon" />
                                        </div>
                                    </Tooltip>
                                </div>
                            </td>
                            <td>
                                {user.email}
                            </td>
                            <td>
                                {user.phoneNumber}
                            </td>
                            <td>
                                <div className="icon-buttons-group">
                                    <Tooltip title="Delete user">
                                        <div className="icon-button mb-0">
                                            <FaUserMinus size={24} className="user-management-icon" />
                                        </div>
                                    </Tooltip>

                                    <Tooltip title="Update user">
                                        <div className="icon-button mb-0">
                                            <FaUserCog size={24} className="user-management-icon" />
                                        </div>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}

export default UserManagement;