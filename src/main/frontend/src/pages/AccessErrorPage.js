import React from 'react';
import '../styles/AccessErrorPage.css';
import {Link} from "react-router-dom";
import accessDeniedImage from '../assets/images/access-denied.jpg';

const AccessErrorPage = () => {
    return (
        <div className="access-error-page">
            <div className="ae-container">
                <h1 className="ae-title">Access Denied</h1>
                <p className="ae-message">Oops! You don't have permission to access this page.</p>
                <div className="ae-illustration-container">
                    <img src={accessDeniedImage} alt="Access Error" className="ae-illustration" />
                </div>
                <Link to="/" className="ae-btn btn-primary mt-4">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default AccessErrorPage;