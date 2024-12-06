// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import HomePage from './components/HomePage';
import QRScanner from './components/QRScanner';
import AdminPage from './components/AdminPage';

const App = () => {
    return (
        <ProductProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/verify" element={<QRScanner />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </Router>
        </ProductProvider>
    );
};

export default App;
