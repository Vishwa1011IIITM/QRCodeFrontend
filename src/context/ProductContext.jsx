import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [state, setState] = useState({
        loading: false,
        error: null,
        product: null,
    });

    const setProduct = (product) => {
        setState({
            ...state,
            loading: false,
            product,
        });
    };

    const setLoading = (loading) => {
        setState({
            ...state,
            loading,
        });
    };

    const setError = (error) => {
        setState({
            ...state,
            error,
        });
    };

    return (
        <ProductContext.Provider value={{ state, setProduct, setLoading, setError }}>
            {children}
        </ProductContext.Provider>
    );
};

export { ProductContext, ProductProvider };
