import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const EntryPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("role") === "ADMIN");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
    };

    return (
        <div className="container mt-4 ">
            <h2>Administration Portal</h2>
            <div className="container d-flex justify-content-center align-items-center vh-100 ">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">{isLoggedIn ? 'Enter' : 'Login'}</h5>
                            <p className="card-text">
                                {isLoggedIn
                                    ? 'Welcome back, boss! Enter to access the admin page.'
                                    : 'Hello, boss! Login to access your account.'}
                            </p>
                            {isLoggedIn ? (
                                <Link to="/admin" className="btn btn-secondary">
                                    Admin Page
                                </Link>
                            ) : (
                                <Link to="/login" className="btn btn-primary">
                                    Login
                                </Link>
                            )}
                        </div>
                        {isLoggedIn && (
                            <div>
                                <button className="btn btn-outline-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default EntryPage;
