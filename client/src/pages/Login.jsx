import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import api from "@/lib/http";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Axios client (api) handles JSON + baseURL + withCredentials
      const { data } = await api.post("/users/signin", { email, password });

      // Store tokens + user in context/storage
      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-4">
        Login to IntPrepApp
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
