import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-purple-700">
        <Link to="/">IntPrepApp</Link>
      </h1>
      <h1 className="text-green-500 text-2xl font-bold">
  Tailwind is working! 🎉
</h1>


      <nav className="space-x-4 text-sm font-medium">
        <Link to="/login" className="text-gray-700 hover:text-purple-600">
          Login
        </Link>
        <Link to="/signup" className="text-gray-700 hover:text-purple-600">
          Signup
        </Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">
          Dashboard
        </Link>
      </nav>
    </header>
  );
};

export default Header;
