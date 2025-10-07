import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-bold text-primary-400">🌱 Garden Planner</span>
            <p className="text-gray-400 mt-2">
              Plan your perfect garden with personalized schedules and smart reminders.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/garden-planner" className="hover:text-white transition-colors">Garden Planner</Link></li>
              <li><Link to="/plant-library" className="hover:text-white transition-colors">Plant Library</Link></li>
              <li><Link to="/schedule" className="hover:text-white transition-colors">Schedule & Reminders</Link></li>
              <li><Link to="/community-forum" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Garden Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
              <li><Link to="/social-media" className="hover:text-white transition-colors">Social Media</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Garden Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
