// public landing page
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 space-y-6 text-center">
        {/* Main heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to IntPrepApp - Your Interview, Mastered.
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Your personalized interview prep toolkit — sharpen your skills with anagram challenges, interview questions, and more.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex justify-center space-x-4">
          <Link
            to="/signup"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded shadow transition duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="border border-purple-600 text-purple-700 font-semibold py-2 px-6 rounded hover:bg-purple-100 transition duration-300"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
