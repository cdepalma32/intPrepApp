// public landing page
import React from 'react';

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Main heading */}
      <h1 className="text-3xl text-green-500">🌿 Tailwind V4 is finally working!</h1>


      {/* Tailwind visual alert box */}
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow">
        <p>Tailwind is working beautifully 🎉</p>
      </div>

      {/* Sample call-to-action button */}
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
        Get Started
      </button>
    </div>
  );
};

export default Home;
