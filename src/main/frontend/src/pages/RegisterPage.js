import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from "../utils/axiosConfig";

const RegisterPage = ({onUserCreated, onCloseModal}) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const handleRegister = async (e) => {
        e.preventDefault();

        // Perform form validation
        const form = e.currentTarget;
        if (form.checkValidity()) {
            try {
                const response = await axiosInstance.post('/auth/register-admin', {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password,
                });
                if (response.status === 200) {
                    // Registration successful, navigate to login page
                    onUserCreated(response.data)
                    onCloseModal()
                } else {
                    // Handle registration error
                    console.error('Registration failed.');
                }
            } catch (error) {
                console.error('Error occurred during registration:', error);
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
        <div className="container mt-4">
            <form onSubmit={handleRegister} noValidate>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                        First name
                    </label>
                    <input
                        type="text"
                        className={`form-control ${formErrors.firstName && 'is-invalid'}`}
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                        Last name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
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
                    <label htmlFor="phoneNumber" className="form-label">
                        Phone number
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
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
                    Register
                </button>
                <div className="mt-2 text-muted">
                    Fields marked with * are required.
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
