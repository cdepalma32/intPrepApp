import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * PR-2 strategy:
 * - If we already have an accessToken → allow immediately.
 * - If we don't, try one silent refresh (getValidAccessToken).
 * - Only redirect if refresh fails (no fresh token).
 *
 * Both ways work:
 *   1) <PrivateRoute><Dashboard/></PrivateRoute> passing children
 *   2) <Route element={<PrivateRoute/>}><Route path="/dashboard" element={<Dashboard/>}/></Route> nested routes
 */
export default function PrivateRoute({ children }) {
  const { accessToken, getValidAccessToken } = useAuth();

  const [checking, setChecking] = useState(true); // while attempting silent refresh
  const [ok, setOk] = useState(false);            // final decision to allow

  useEffect(() => {
    let alive = true;

    (async () => {
      // If we already have a token in memory, allow right away
      if (accessToken) {
        if (alive) {
          setOk(true);
          setChecking(false);
        }
        return;
      }

      // Otherwise, try 1 silent refresh (reads refreshToken from localStorage)
      const fresh = await getValidAccessToken();
      if (!alive) return;

      setOk(Boolean(fresh));
      setChecking(false);
    })();

    return () => {
      alive = false; // avoid setting state if component unmounts
    };
  }, [accessToken, getValidAccessToken]);

  // Optional loading state while checking
  if (checking) {
    return null; // loader component?
  }

  // Allow: render children if provided; otw render nested route via <Outlet/>
  if (ok) {
    return children ?? <Outlet />;
  }

  // Deny: redirect to login
  return <Navigate to="/login" replace />;
}
