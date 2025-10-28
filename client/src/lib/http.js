import axios from "axios";
import { authBridge } from "@/context/authBridge";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ---- Attach Authorization on every request
api.interceptors.request.use((config) => {
  const at = authBridge.getAccessToken();
  if (at) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${at}`;
  }
  return config;
});

// ---- Single-flight refresh state
let refreshPromise = null;
let subscribers = [];

const subscribe = (fn) => subscribers.push(fn);
const notifyAll = (token) => {
  subscribers.forEach((fn) => fn(token));
  subscribers = [];
};

const runRefresh = async () => {
  const rt = localStorage.getItem("refreshToken");
  if (!rt) throw new Error("No refresh token");

  const r = await axios.post(
    "/api/users/refresh",
    { refreshToken: rt },
    { withCredentials: true }
  );

  const { accessToken, refreshToken } = r.data || {};
  if (!accessToken) throw new Error("No access token in refresh response");

  authBridge.setAccessToken(accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

  return accessToken;
};

// ---- 401 handler with retry-once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    const status = response?.status;
    const url = config?.url || "";
    const alreadyRetried = config?._retried;

    // If not a 401, or this is the refresh call itself, or we've already retried → pass through
    if (status !== 401 || url.includes("/users/refresh") || alreadyRetried) {
      return Promise.reject(error);
    }

    // Kick off a single refresh if not in progress
    if (!refreshPromise) {
      refreshPromise = runRefresh()
        .then((token) => {
          notifyAll(token);
          return token;
        })
        .catch((e) => {
          notifyAll(null);
          throw e;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    // Wait for refresh result, then retry (or logout on failure)
    return new Promise((resolve, reject) => {
      subscribe((newToken) => {
        if (!newToken) {
          // refresh failed → hard logout
          authBridge.clear();
          localStorage.removeItem("refreshToken");
          // adjust if route is /signin
          window.location.assign("/signin");
          return reject(error);
        }
        try {
          const retryConfig = {
            ...config,
            _retried: true,
            headers: { ...(config.headers || {}), Authorization: `Bearer ${newToken}` },
          };
          resolve(api.request(retryConfig));
        } catch (e) {
          reject(e);
        }
      });
    });
  }
);

export default api;
