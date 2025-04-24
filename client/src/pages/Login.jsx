import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-4">Login to IntPrepApp</h2>

      <form className="space-y-4">
        {/* Email Field */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="you@example.com" />
        </div>

        {/* Password Field */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="••••••••" />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
