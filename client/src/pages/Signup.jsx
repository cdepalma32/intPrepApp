// import React from 'react';

// const Signup = () => {
//   return (
//     <div>
//       <h2>Sign Up</h2>
//       {/* Signup form will go here */}
//     </div>
//   );
// };

// export default Signup;


import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "@/context/AuthContext";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// simple validators (same rules as backend should enforce)
const emailRegex = /^\S+@\S+\.\S+$/;
// min 8, at least one letter, one number, one special char
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // client-side validation
    if (!username.trim()) {
      return setError("Username is required.");
    }
    if (!emailRegex.test(email)) {
      return setError("Enter a valid email address.");
    }
    if (!passwordRegex.test(password)) {
      return setError(
        "Password must be 8+ chars and include a letter, a number, and a special character."
      );
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // keep parity w/ your login flow
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Signup failed");

      // same AuthContext flow as Login.jsx
      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-4">Create your IntPrepApp account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

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
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min 8 chars, include letter+number+symbol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Special characters like !@#$%^&*() are allowed.
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </Button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="underline">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
