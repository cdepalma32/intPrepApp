// src/components/Header.jsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      {/* Logo or Tagline */}
      <h1 className="text-xl font-semibold text-purple-700">
        <Link to="/">IntPrepApp</Link>
      </h1>

      {/* Navigation (pre-login state) */}
      <nav className="space-x-4 text-sm font-medium">
        <Link to="/login" className="text-gray-700 hover:text-purple-600">
          Login
        </Link>
        <Link to="/signup" className="text-gray-700 hover:text-purple-600">
          Sign up
        </Link>
      </nav>
    </header>
  );
};

export default Header;
