import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PredictionForm from './components/PredictionForm';
import NGORegistration from './components/NGORegistration';
import RestaurantRegistration from './components/RestaurantRegistration';
import RouteVisualization from './components/RouteVisualization';
import MapView from './components/MapView';
import RestaurantDatabase from './components/RestaurantDatabase';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [restaurants, setRestaurants] = useState([]);
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetchRestaurants();
    fetchNGOs();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const data = await response.json();
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchNGOs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ngos');
      const data = await response.json();
      setNgos(data.ngos || []);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'map', label: '🗺️ Map View', icon: '🗺️' },
    { id: 'database', label: '📊 Restaurant DB', icon: '📊' },
    { id: 'predict', label: '🔮 Predict Surplus', icon: '🔮' },
    { id: 'restaurant', label: '🏪 Register Restaurant', icon: '🏪' },
    { id: 'ngo', label: '🤝 Register NGO', icon: '🤝' },
    { id: 'routes', label: '📍 Routes', icon: '📍' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <nav className="bg-gradient-to-r from-orange-600 via-white to-green-600 shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🍛</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                  அன்னதானம் - Food Waste Redistribution
                </h1>
                <p className="text-xs text-gray-600">Tamil Nadu Food Rescue Network</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-orange-600 font-semibold">🇮🇳</span>
              <span className="text-sm font-medium text-gray-700">Tamil Nadu</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg mb-6 border-t-4 border-orange-500">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-6 text-sm font-semibold border-b-4 transition-all whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'map' && <MapView />}
          {activeTab === 'database' && <RestaurantDatabase />}
          {activeTab === 'predict' && (
            <PredictionForm restaurants={restaurants} />
          )}
          {activeTab === 'restaurant' && (
            <RestaurantRegistration onSuccess={fetchRestaurants} />
          )}
          {activeTab === 'ngo' && (
            <NGORegistration onSuccess={fetchNGOs} />
          )}
          {activeTab === 'routes' && (
            <RouteVisualization restaurants={restaurants} ngos={ngos} />
          )}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-orange-600 via-white to-green-600 border-t-4 border-orange-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-semibold text-orange-700">🙏 அன்னதானம்</p>
              <p className="text-xs text-gray-600">Serving Tamil Nadu</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">🌾 Zero Hunger Initiative</p>
              <p className="text-xs text-gray-600">Reducing food waste, feeding communities</p>
            </div>
            <div>
              <p className="font-semibold text-green-700">🇮🇳 Made in India</p>
              <p className="text-xs text-gray-600">Built for social impact</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
