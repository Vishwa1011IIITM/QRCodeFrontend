import React, { useState } from 'react';
import ReactQR from 'react-qr-code';
import api from '../api'; // Assuming api.js is set up for making requests to the backend
import { v4 as uuidv4 } from 'uuid'; // Importing the uuid library to generate UUIDs
import './AdminPage.css'; // Import CSS file for styling

const AdminPage = () => {
    const [productDetails, setProductDetails] = useState({
        name: '',
        stationId: '',
        uuid: uuidv4(), // Automatically generate a UUID for the product
    });
    const [signedQRCode, setSignedQRCode] = useState(null);

    // Handle input changes for product details
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetails({
            ...productDetails,
            [name]: value,
        });
    };

    // Generate QR code and send to backend for signing
    const generateQRCode = async () => {
        const qrCodeData = {
            name: productDetails.name,
            stationId: productDetails.stationId,
            uuid: productDetails.uuid,
        };

        try {
            const response = await api.post('/api/products/sign', qrCodeData);
            setSignedQRCode(response.data.signedQRCode); // Assuming signed QR code is returned
        } catch (error) {
            console.error('Error signing QR code:', error);
        }
    };

    // Download the signed QR code as SVG
    const downloadQRCodeAsSVG = () => {
        const qrCodeSVG = document.getElementById('signed-qr-code-svg'); // Reference the SVG element
        const svgData = new XMLSerializer().serializeToString(qrCodeSVG); // Serialize the SVG to a string

        const blob = new Blob([svgData], { type: 'image/svg+xml' }); // Create a Blob with the SVG data
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'product-qr-code.svg'; // Set filename for the downloaded SVG
        link.click(); // Trigger the download
    };

    return (
        <div className="admin-page">
            <h2>Admin: Sign QR Code</h2>
            <div className="form-container">
                <div className="input-group">
                    <label htmlFor="name">Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={productDetails.name}
                        onChange={handleInputChange}
                        placeholder="Enter Product Name"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="stationId">Station ID:</label>
                    <input
                        type="text"
                        name="stationId"
                        value={productDetails.stationId}
                        onChange={handleInputChange}
                        placeholder="Enter Station ID"
                    />
                </div>
                <div className="input-group">
                    <label>UUID:</label>
                    <span className="uuid-text">{productDetails.uuid}</span> {/* Show the UUID as plain text */}
                </div>
                <button className="generate-btn" onClick={generateQRCode}>Generate and Sign QR Code</button>
            </div>

            {signedQRCode && (
                <div className="qr-code-container">
                    <h3>Signed QR Code (For Storing):</h3>
                    <div id="signed-qr-code-svg" className="qr-code-display">
                        <ReactQR value={signedQRCode} size={256} />
                    </div>
                    <button className="download-btn" onClick={downloadQRCodeAsSVG}>Download QR Code as SVG</button>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
