/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { authBridge } from '@/context/authBridge';

// Create context
const AuthContext = createContext(null);

function decodeJwtExp(token) {
  try {
    const [, payloadBase64] = token.split('.');
    const b64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/'); // base64url → base64
    const json = atob(b64);
    const payload = JSON.parse(json);
    return payload?.exp ? payload.exp * 1000 : null; // ms
  } catch {
    return null;
  }
}

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // name, email, role, etc.

  // Bridge init so non-React modules (http.js) can access token safely
  useEffect(() => {
    authBridge.init({
      getAccessToken: () => accessToken,
      setAccessToken: (t) => setAccessToken(t),
      clear: () => logout(),
    });
  }, [accessToken]);

  // Attempt to auto-refresh token on app load
  useEffect(() => {
    const rt = localStorage.getItem('refreshToken');
    if (rt && !accessToken) {
      refreshAccessToken(rt);
    }
  }, []);

  // Request new access/refresh token pair from backend
  const refreshAccessToken = async (token = null) => {
    try {
      const storedRefreshToken = token || localStorage.getItem('refreshToken');
      if (!storedRefreshToken) return null;

      const res = await fetch('/api/users/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ok if you later move refresh to cookies
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!res.ok) {
        logout();
        return null;
      }

      const { accessToken: newAT, refreshToken: newRT, user: userObj } = await res.json();
      setAccessToken(newAT);
      setUser(userObj || null);
      if (newRT) localStorage.setItem('refreshToken', newRT); // rotate token
      return newAT; // return the fresh token for immediate use
    } catch (err) {
      console.error('[Auto Token Refresh Failed]', err);
      logout();
      return null;
    }
  };

  const getValidAccessToken = async () => {
    // No token yet → try refresh
    if (!accessToken) {
      const fresh = await refreshAccessToken();
      return fresh;
    }

    // Has token → check expiry; refresh if expired
    const expMs = decodeJwtExp(accessToken);
    const isExpired = expMs ? Date.now() >= expMs : false;

    if (isExpired) {
      const fresh = await refreshAccessToken();
      return fresh;
    }
    return accessToken;
  };

  const login = ({ accessToken: at, refreshToken: rt, user: userObj }) => {
    setAccessToken(at);
    setUser(userObj || null);
    if (rt) localStorage.setItem('refreshToken', rt);
  };

  // Logout function
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('refreshToken');
  };

/* eslint-disable react-hooks/exhaustive-deps */
const value = useMemo(() => ({
  user,
  accessToken,
  login,
  logout,
  refreshAccessToken,
  getValidAccessToken,
}), [user, accessToken]);
/* eslint-enable react-hooks/exhaustive-deps */


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
