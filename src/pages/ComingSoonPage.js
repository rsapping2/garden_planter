import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoonPage = ({ title, description, icon = "🚧" }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="text-8xl mb-6">{icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {description}
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;


