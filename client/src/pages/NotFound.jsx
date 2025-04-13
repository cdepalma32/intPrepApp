// Fallback 404 page, catch bad routes / keep UX clean
import React from 'react';

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn’t exist.</p>
    </div>
  );
};

export default NotFound;
