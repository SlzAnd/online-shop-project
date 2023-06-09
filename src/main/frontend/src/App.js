import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminPage from "./pages/AdminPage";
import 'bootstrap/dist/css/bootstrap.css';
import AccessErrorPage from "./pages/AccessErrorPage";



const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path="/" element={<EntryPage/>} />
                    <Route path="/register" element={<RegisterPage/>} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/admin" element={<AdminPage/>} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                    <Route path="/accessErr" element={<AccessErrorPage/>} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
