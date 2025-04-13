import React, { createContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null); // can hold name, email, role, token, etc.

    // Login function
    const login = (userData) => {
        setUser(userData);
        // optionally store in localStorage/sessionStorage
        // LocalStorage.setItem('user', JSON.strinify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        // LocalStorage.remoteItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
};
