import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ showWelcome = true }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              🌱 Garden Planner
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">
              Dashboard
            </Link>
            <Link to="/garden-planner" className="text-gray-600 hover:text-primary-600">
              Garden Planner
            </Link>
            <Link to="/plant-library" className="text-gray-600 hover:text-primary-600">
              Plant Library
            </Link>
            <Link to="/schedule" className="text-gray-600 hover:text-primary-600">
              Task Schedule
            </Link>
            <Link to="/notifications" className="text-gray-600 hover:text-primary-600">
              Notifications
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-primary-600">
              Profile
            </Link>
            
            <button
              onClick={logout}
              className="text-gray-600 hover:text-primary-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Welcome message below header - positioned on the right */}
      {showWelcome && user && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end py-2">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold text-gray-900">{user.name}</span>!
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
