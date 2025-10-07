import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { user, logout } = useAuth();

  const features = [
    {
      icon: '🌱',
      title: 'Interactive Garden Layout',
      description: 'Drag and drop plants to design your perfect garden layout with real-time spacing and companion planting suggestions.'
    },
    {
      icon: '📅',
      title: 'Personalized Planting Schedule',
      description: 'Get customized planting and harvest schedules based on your location and USDA hardiness zone.'
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Never miss a watering or harvest with intelligent notifications tailored to your garden\'s needs.'
    },
    {
      icon: '🌿',
      title: 'Plant Library',
      description: 'Access a comprehensive database of plants with detailed growing information and companion planting guides.'
    },
    {
      icon: '📊',
      title: 'Harvest Planning',
      description: 'Plan your harvest schedule with detailed planting and harvest windows based on your USDA zone.'
    },
    {
      icon: '👥',
      title: 'Community Sharing',
      description: 'Share your garden designs and learn from other gardeners in your area.'
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">🌱 Garden Planter</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="text-gray-600 hover:text-primary-600">
                    Sign In
                  </Link>
                  <Link to="/auth" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Garden by{' '}
            <span className="text-primary-600">Location</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create the perfect garden with personalized planting schedules, smart reminders, 
            and interactive planning tools tailored to your USDA hardiness zone.
          </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <button
                onClick={logout}
                className="btn-secondary text-lg px-8 py-3"
              >
                Sign Out
              </button>
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn-primary text-lg px-8 py-3">
                Start Planning Free
              </Link>
              <Link to="/plant-library" className="btn-secondary text-lg px-8 py-3">
                Browse Plants
              </Link>
            </>
          )}
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From planning to harvest, Garden Planter provides all the tools you need for a successful garden.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Available Now
            </h2>
            <p className="text-xl text-gray-600">
              Start planning your garden with these core features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-3">Interactive Garden Layout</h3>
              <p className="text-gray-600">Drag and drop plants to design your garden with real-time spacing guidance.</p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-3">Task Scheduling</h3>
              <p className="text-gray-600">Create and manage planting, watering, and harvest tasks in a calendar view.</p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-3">Plant Database</h3>
              <p className="text-gray-600">Browse 30+ plants with growing information and companion planting guides.</p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-3">USDA Zone Support</h3>
              <p className="text-gray-600">Automatic zone detection and zone-specific planting recommendations.</p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-semibold mb-3">Local Storage</h3>
              <p className="text-gray-600">Your garden designs and tasks are saved locally and persist between sessions.</p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold mb-3">Mock Notifications</h3>
              <p className="text-gray-600">Preview notification system (email integration coming soon).</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">🚧 Coming Soon</h3>
              <p className="text-blue-800">
                <strong>Progress Tracking:</strong> Visual timelines, harvest logging, growth photos, custom carden bed sizes, detailed garden analytics are in development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Dream Garden?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join other gardeners and start planning your perfect garden today.
          </p>
          {!user && (
            <Link to="/auth" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200">
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-primary-400">🌱 Garden Planter</span>
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
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
                <li><Link to="/social-media" className="hover:text-white transition-colors">Social Media</Link></li>
                <li><Link to="/community-forum" className="hover:text-white transition-colors">Community Forum</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Garden Planter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
