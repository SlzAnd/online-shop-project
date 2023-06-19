import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const handleLogin = async (e) => {
        e.preventDefault();

        // Perform form validation
        const form = e.currentTarget;
        if (form.checkValidity()) {
            try {
                const response = await axios.post('http://localhost:8080/api/auth/authenticate', {
                    email,
                    password,
                });
                if (response.status === 200) {
                    // remove old token if it exists
                    localStorage.removeItem("token");
                    localStorage.removeItem("role")
                    // Login successful, store the token and navigate to home page or dashboard
                    const userRole = response.data.role;
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", userRole);
                    console.log(userRole)
                    userRole === "ADMIN"
                    ? navigate('/admin')
                    : navigate('/accessErr');
                } else {
                    // Handle authentication error
                    console.error('Authentication failed.');
                }
            } catch (error) {
                console.error('Error occurred during authentication:', error);
            }
        } else {
            // Get the form validation errors
            const elements = form.elements;
            const errors = {};

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (!element.validity.valid) {
                    errors[element.id] = element.validationMessage;
                }
            }

            // Set the form errors state
            setFormErrors(errors);
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleLogin} noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email *
                    </label>
                    <input
                        type="email"
                        className={`form-control ${formErrors.email && 'is-invalid'}`}
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password *
                    </label>
                    <input
                        type="password"
                        className={`form-control ${formErrors.password && 'is-invalid'}`}
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
