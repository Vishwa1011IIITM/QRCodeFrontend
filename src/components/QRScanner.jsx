import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { ProductContext } from '../context/ProductContext';
import api from '../api';

const QRScanner = () => {
    const { state, setLoading, setProduct, setError } = useContext(ProductContext);  // Accessing context values and dispatch functions
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const videoRef = useRef(null);
    const [scanResult, setScanResult] = useState(null);
    const [scannerReady, setScannerReady] = useState(false);  // Define the scannerReady state
    const [cameraError, setCameraError] = useState(null);

    // Request location when button is clicked
    const requestLocation = () => {
        setLocationLoading(true);
        setLocationError(null); // Clear any previous errors

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setLocationLoading(false);
            },
            (error) => {
                console.error('Error fetching location:', error);
                setLocationError('Failed to access location');
                setLocationLoading(false);
            }
        );
    };

    useEffect(() => {
        if (location && videoRef.current) {
            const codeReader = new BrowserMultiFormatReader();

            // Start scanning when location is set and video element is ready
            codeReader
                .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
                    if (result) {
                        setScanResult(result.text);
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        console.error(err);
                    }
                })
                .then(() => {
                    console.log('QR scanner initialized');
                })
                .catch((err) => {
                    console.error('Error initializing QR scanner:', err);
                    setCameraError('Failed to access the camera. Please ensure camera permissions are granted.');
                });

            return () => {
                codeReader.reset();
            };
        }
    }, [location]);

    useEffect(() => {
        if (scanResult) {
            // Handle verification once QR code is scanned
            setLoading(true);  // Dispatch loading state

            api
                .post('/verify', {
                    encryptedUUID: scanResult,
                    location,
                })
                .then((response) => {
                    setProduct(response.data.product);  // Dispatch product data
                    setLoading(false);  // Dispatch loading state false after successful response
                })
                .catch((error) => {
                    console.error('Verification failed:', error);
                    setError('Verification failed!');  // Dispatch error
                    setLoading(false);  // Dispatch loading state false in case of error
                });
        }
    }, [scanResult, setLoading, setProduct, setError, location]);

    return (
        <div>
            <h2>QR Code Scanner</h2>

            {/* Button to request location */}
            <div>
                <button onClick={requestLocation} disabled={locationLoading || location}>
                    {locationLoading ? 'Fetching location...' : 'Allow Location Access'}
                </button>
                {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
            </div>

            {/* Show loading message until location is available */}
            {!location ? (
                <p>{locationLoading ? 'Please wait while we fetch your location...' : 'Click to allow location access'}</p>
            ) : (
                <p>Your location is set! You can now scan QR codes for verification.</p>
            )}

            {/* Video element for QR scanner */}
            {location && (
                <div>
                    <video
                        ref={videoRef}
                        style={{ width: '100%', maxWidth: '500px' }}
                        onPlay={() => setScannerReady(true)}  // Set scannerReady to true when video plays
                    />
                    {!scannerReady && <p>Loading camera...</p>}
                </div>
            )}

            {/* Display the scan result */}
            {scanResult && !locationLoading && (
                <div>
                    <h3>Scan Result:</h3>
                    <p>{scanResult}</p>
                </div>
            )}

            {/* Handle Camera Errors */}
            {cameraError && (
                <div>
                    <p style={{ color: 'red' }}>{cameraError}</p>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
