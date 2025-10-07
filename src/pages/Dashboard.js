import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGarden } from '../contexts/GardenContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { user } = useAuth();
  const { gardens, getUpcomingTasks, loading, createGarden, deleteGarden } = useGarden();
  const navigate = useNavigate();
  const [showCreateGarden, setShowCreateGarden] = useState(false);
  const [newGardenName, setNewGardenName] = useState('');

  const upcomingTasks = getUpcomingTasks();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleCreateGarden = (e) => {
    e.preventDefault();
    
    // Check garden limit
    if (gardens.length >= 2) {
      alert('You can only have up to 2 gardens. Please delete an existing garden to create a new one.');
      return;
    }
    
    if (newGardenName.trim()) {
      try {
        const newGarden = createGarden({
          name: newGardenName.trim(),
          size: '3x6',
          description: `A ${newGardenName.trim()} garden`
        });
        console.log('Created garden:', newGarden);
        setNewGardenName('');
        setShowCreateGarden(false);
      } catch (error) {
        console.error('Error creating garden:', error);
        alert('Failed to create garden. Please try again.');
      }
    }
  };

  const handleDeleteGarden = (gardenId, gardenName) => {
    if (window.confirm(`Are you sure you want to delete "${gardenName}"? This action cannot be undone.`)) {
      try {
        deleteGarden(gardenId);
        console.log('Deleted garden:', gardenId);
      } catch (error) {
        console.error('Error deleting garden:', error);
        alert('Failed to delete garden. Please try again.');
      }
    }
  };

  const determineUSDAZone = (zipCode) => {
    if (!zipCode) return 'Unknown';
    
    const zipNum = parseInt(zipCode);
    
    // Simplified USDA zone mapping based on zip codes
    if (zipNum >= 33000 && zipNum <= 34999) return '9b'; // South Florida
    if (zipNum >= 90000 && zipNum <= 96199) return '10a'; // Southern California
    if (zipNum >= 85000 && zipNum <= 86999) return '9a'; // Arizona
    if (zipNum >= 78000 && zipNum <= 79999) return '8b'; // Texas
    if (zipNum >= 30000 && zipNum <= 32999) return '8a'; // Georgia
    if (zipNum >= 27000 && zipNum <= 28999) return '7b'; // North Carolina
    if (zipNum >= 20000 && zipNum <= 26999) return '7a'; // Mid-Atlantic
    if (zipNum >= 10000 && zipNum <= 19999) return '6b'; // Northeast
    if (zipNum >= 1000 && zipNum <= 9999) return '6a'; // New England
    
    return '7a'; // Default zone
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your garden data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showWelcome={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your gardens and track your growing progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🌱</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Gardens</p>
                <p className="text-2xl font-semibold text-gray-900">{gardens.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📋</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🌍</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">USDA Zone</p>
                <p className="text-2xl font-semibold text-gray-900">{user?.usdaZone || determineUSDAZone(user?.zipCode)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gardens Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Gardens</h2>
            <button
              onClick={() => setShowCreateGarden(true)}
              disabled={gardens.length >= 2}
              className={`btn-primary ${gardens.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={gardens.length >= 2 ? 'Maximum 2 gardens allowed' : 'Create a new garden'}
            >
              {gardens.length >= 2 ? 'Garden Limit Reached' : 'Create New Garden'}
            </button>
          </div>

          {gardens.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No gardens yet</h3>
              <p className="text-gray-500 mb-4">Create your first garden to start planning your plants!</p>
              <button
                onClick={() => setShowCreateGarden(true)}
                className="btn-primary"
              >
                Create Your First Garden
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gardens.map((garden) => (
                <div key={garden.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{garden.name}</h3>
                      <p className="text-sm text-gray-500">Size: {garden.size || '3x6'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGarden(garden.id, garden.name)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      title="Delete garden"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Plants: {garden.layout?.plants?.length || 0}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(((garden.layout?.plants?.length || 0) / 18) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {garden.layout?.plants?.length || 0} of 18 slots filled
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/garden-planner?garden=${garden.id}`}
                      className="flex-1 btn-primary text-center"
                    >
                      Plan Garden
                    </Link>
                    <Link
                      to="/schedule"
                      className="flex-1 btn-secondary text-center"
                    >
                      View Schedule
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Tasks</h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {task.type === 'watering' && '💧'}
                          {task.type === 'planting' && '🌱'}
                          {task.type === 'harvest' && '🌾'}
                          {task.type === 'fertilizing' && '🌿'}
                          {task.type === 'pruning' && '✂️'}
                          {task.type === 'other' && '📋'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
                {upcomingTasks.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link to="/schedule" className="text-primary-600 hover:text-primary-800 font-medium">
                      View all {upcomingTasks.length} tasks →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Garden Modal */}
        {showCreateGarden && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Garden</h3>
                <form onSubmit={handleCreateGarden}>
                  <div className="mb-4">
                    <label htmlFor="gardenName" className="block text-sm font-medium text-gray-700 mb-2">
                      Garden Name
                    </label>
                    <input
                      type="text"
                      id="gardenName"
                      value={newGardenName}
                      onChange={(e) => setNewGardenName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Vegetable Garden, Herb Garden"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garden Size
                    </label>
                    <p className="text-sm text-gray-500">3x6 grid (18 planting slots)</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateGarden(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Create Garden
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Zone Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Growing Zone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">USDA Zone {user?.usdaZone || determineUSDAZone(user?.zipCode)}</h3>
              <p className="text-gray-600 mb-4">
                Your location determines the best planting times and suitable plants for your garden.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Location:</span>
                  <span className="text-sm font-medium">{user?.zipCode || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Climate:</span>
                  <span className="text-sm font-medium">Temperate</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recommended for your zone:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-800">🍅 Tomatoes</span>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-800">🥬 Lettuce</span>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-800">🌿 Basil</span>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-800">🥕 Carrots</span>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/plant-library" className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                  Browse all plants →
                </Link>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mt-2">
                  Perfect for outdoor gardening!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
