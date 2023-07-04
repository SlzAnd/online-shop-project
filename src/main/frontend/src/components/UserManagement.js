import axiosInstance from "../utils/axiosConfig";
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/OrderManager.css';
import React, {useEffect, useState} from "react";
import Tooltip from '@mui/material/Tooltip';
import {FaUserPlus, FaUserEdit, FaUserMinus, FaUserCog} from "react-icons/fa";
import '../styles/UserManagement.css';
import {Button, Modal} from "react-bootstrap";
import RegisterPage from "../pages/RegisterPage";
import UpdateUserForm from "./UpdateUserForm";




const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [filter, setFilter] = useState('All');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [createdUser, setCreatedUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({});



    const handleUserCreated = (user) => {
        setCreatedUser(user);
    };

    const handleUserUpdated = (user) => {
        setUpdatedUser(user);
    }


    const handleCloseCreateUserModal = () => {
        setShowCreateUserModal(false);
    };

    const handleOpenCreateUserModal = () => {
        setShowCreateUserModal(true);
    };

    const handleCloseUpdateUserModal = () => {
        setShowUpdateUserModal(false);
    };

    const handleOpenUpdateUserModal = (user) => {
        setSelectedUser(user);
        setShowUpdateUserModal(true);
    };

    useEffect(() => {
        fetchUsers().catch((err) => console.error("Error in the fetchUsers: ", err));
    }, []);

    useEffect(() => {
        handleFilterChange(filter);
    }, [users, filter]);

    useEffect(() => {
        if (createdUser) {
            setUsers((prevUsers) => [...prevUsers, createdUser]);
            setCreatedUser(null);
        }
    }, [createdUser])

    useEffect(() => {
        if (updatedUser) {
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user))
            );
            setUpdatedUser(null);
        }
    }, [updatedUser]);

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

    const handleSelectNewRole = (userId, newRole) => {
        setSelectedRoles((prevRoles) => ({
            ...prevRoles,
            [userId]: newRole,
        }));
    };

    const handleDeleteConfirmation = (user) => {
        setSelectedUser(user);
        setShowDeleteConfirmation(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
    };

    const handleDeleteUser = async () => {
        const userId = selectedUser.id;
        try {
            const response = await axiosInstance.delete(`/users/${userId}`);
            console.log(response.data)
            if (response.status === 200) {
                setShowDeleteConfirmation(false);
                await fetchUsers('')
            }
        } catch (e) {
            console.error('Error updating role: ', e);
        }
    }

    const handleChangeRole = async (userId) => {
        const newRole = selectedRoles[userId];
        try {
            console.log(newRole)
            const response = await axiosInstance.put(`/users/${userId}/changeRole`,`"${newRole}"`, {
                headers: {
                    'Content-Type': 'application/json'
                }});
            console.log(response.data)
            if(response.status === 200) {
                await fetchUsers('')
            }
        } catch (e) {
            console.error('Error updating role: ', e);
        }
    }

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
                    <div className="user-management-option" onClick={handleOpenCreateUserModal}>
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
                            <td className="text-center align-middle">
                                {user.firstName} {user.lastName}
                            </td>
                            <td>
                                <div className="d-flex align-items-center justify-content-start mb-0">
                                    <div className="mb-0">
                                        <select className="form-select form-select-sm"
                                                aria-label=".form-select-sm"
                                                value={selectedRoles[user.id] || user.role}
                                                onChange={(e) => handleSelectNewRole(user.id, e.target.value)}>
                                            <option value={user.role}>{user.role}</option>
                                            {user.role==="ADMIN"
                                                ? <option value="USER">USER</option>
                                                : <option value="ADMIN">ADMIN</option>}
                                        </select>
                                    </div>
                                    <Tooltip title="Change role">
                                        <div className="icon-button mb-0" onClick={() => handleChangeRole(user.id)}>
                                            <FaUserEdit size={24} className="user-management-icon" />
                                        </div>
                                    </Tooltip>
                                </div>
                            </td>
                            <td className="text-center align-middle">
                                {user.email}
                            </td>
                            <td className="text-center align-middle">
                                {user.phoneNumber}
                            </td>
                            <td>
                                <div className="icon-buttons-group">
                                    <Tooltip title="Delete user">
                                        <div className="icon-button mb-0" onClick={() => handleDeleteConfirmation(user)}>
                                            <FaUserMinus size={24} className="user-management-icon" />
                                        </div>
                                    </Tooltip>

                                    <Tooltip title="Update user">
                                        <div className="icon-button mb-0" onClick={() => handleOpenUpdateUserModal(user)}>
                                            <FaUserCog size={24} className="user-management-icon" />
                                        </div>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/*create new admin user window*/}
            <Modal show={showCreateUserModal} onHide={handleCloseCreateUserModal} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>Register New Administrator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegisterPage onCloseModal={handleCloseCreateUserModal} onUserCreated={handleUserCreated}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateUserModal}>
                        Close
                    </Button>
                    {/* Additional buttons or actions */}
                </Modal.Footer>
            </Modal>



            {/*update user info window*/}
            <Modal show={showUpdateUserModal} onHide={handleCloseUpdateUserModal} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpdateUserForm onCloseModal={handleCloseUpdateUserModal} onUserUpdated={handleUserUpdated} user={selectedUser}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdateUserModal}>
                        Close
                    </Button>
                    {/* Additional buttons or actions */}
                </Modal.Footer>
            </Modal>


            {/* Confirmation Modal */}
            <Modal
                show={showDeleteConfirmation}
                onHide={handleCloseDeleteConfirmation}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default UserManagement;