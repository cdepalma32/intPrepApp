import React, { createContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser ] = useState(null); // can hold name, email, role, token, etc.

    // Attempt to auto-refresh token on app load
    useEffect(() => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && !accessToken) {
            refreshAccessToken(refreshToken);
        }
    }, []);

    // Request new access/refresh token pair from backend
    const refreshAccessToken = async (token = null) => {
        try {
            const storedRefreshToken = token || localStorage.getItem('refreshToken');
            if (!storedRefreshToken) return;

            const res = await fetch('/api/users/refresh', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });

            if (res.ok) {
                const { accessToken, refreshToken, user } = await res.json();
                setAccessToken(accessToken);
                setUser(user);
                localStorage.setItem('refreshToken', refreshToken); // rotate token
            } else {
                logout();
            }
            } catch (err) {
                console.error('[Auto Token Refresh Failed]', err);
                logout();
            }
        };
    
        const login = ({ accessToken, refreshToken, user }) => {
            setAccessToken(accessToken);
            setUser(user);
            localStorage.setItem('refreshToken', refreshToken);
        };

    // Logout function
    const logout = () => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;