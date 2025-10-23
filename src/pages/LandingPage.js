import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { user, logout } = useAuth();

  const features = [
    {
      icon: '🌱',
      title: 'Interactive Garden Layout',
      description: 'Drag and drop plants to design your perfect garden layout with real-time spacing and companion planting suggestions.',
      status: 'available'
    },
    {
      icon: '📅',
      title: 'Personalized Planting Schedule',
      description: 'Get customized planting and harvest schedules based on your location and USDA hardiness zone.',
      status: 'available'
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Never miss a watering or harvest with intelligent notifications tailored to your garden\'s needs.',
      status: 'available'
    },
    {
      icon: '🌿',
      title: 'Plant Library',
      description: 'Access a comprehensive database of plants with detailed growing information and companion planting guides.',
      status: 'available'
    },
    {
      icon: '📊',
      title: 'Harvest Planning',
      description: 'Plan your harvest schedule with detailed planting and harvest windows based on your USDA zone.',
      status: 'available'
    },
    {
      icon: '📈',
      title: 'Garden Progress Tracking',
      description: 'Monitor your garden\'s growth with photo documentation, growth milestones, and success rate tracking for each plant.',
      status: 'coming-soon'
    },
    {
      icon: '📊',
      title: 'Visual Timelines',
      description: 'Track your garden\'s development with visual timelines showing planting, growth, and harvest phases.',
      status: 'coming-soon'
    },
    {
      icon: '📝',
      title: 'Harvest Logging',
      description: 'Record and track your harvests with detailed logging of yields, dates, and quality notes.',
      status: 'coming-soon'
    },
    {
      icon: '📸',
      title: 'Growth Photos',
      description: 'Document your garden\'s progress with photo timelines and growth comparison tools.',
      status: 'coming-soon'
    },
    {
      icon: '📐',
      title: 'Custom Garden Bed Sizes',
      description: 'Design gardens with custom bed dimensions and shapes to match your exact space.',
      status: 'coming-soon'
    },
    {
      icon: '📈',
      title: 'Garden Analytics',
      description: 'Get detailed insights into your garden\'s performance with yield tracking and success analytics.',
      status: 'coming-soon'
    },
    {
      icon: '👥',
      title: 'Community Sharing',
      description: 'Share your garden designs and learn from other gardeners in your area.',
      status: 'coming-soon'
    },
    {
      icon: '🌡️',
      title: 'Weather Integration',
      description: 'Plan your garden around local weather patterns with frost dates and rainfall predictions.',
      status: 'coming-soon'
    },
    {
      icon: '🧪',
      title: 'Soil Health Tracking',
      description: 'Monitor soil conditions with pH tracking, nutrient analysis, and improvement recommendations.',
      status: 'coming-soon'
    },
    {
      icon: '🐛',
      title: 'Pest & Disease Management',
      description: 'Identify and prevent garden pests and diseases with early warning systems and treatment solutions.',
      status: 'coming-soon'
    },
    {
      icon: '💧',
      title: 'Smart Watering System',
      description: 'Optimize watering with soil moisture tracking, rainfall integration, and water conservation tips.',
      status: 'coming-soon'
    },
    {
      icon: '🌰',
      title: 'Seed Starting Planner',
      description: 'Plan indoor seed starting with optimal timing, germination tracking, and transplant scheduling.',
      status: 'coming-soon'
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
            {features.filter(feature => feature.status === 'available').map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Available Now
                  </span>
                </div>
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

      {/* Coming Soon Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Exciting new features in development to make your garden planning even better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.filter(feature => feature.status === 'coming-soon').map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    🕐 Coming Soon
                  </span>
                </div>
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
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Pinterest">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Garden Planter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
