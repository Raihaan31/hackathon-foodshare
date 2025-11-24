import React, { useState } from 'react';

const RouteVisualization = ({ restaurants, ngos }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [surplusAmount, setSurplusAmount] = useState(20);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculateRoute = async () => {
    if (!selectedRestaurant) {
      alert('Please select a restaurant');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: selectedRestaurant,
          surplus_kg: surplusAmount,
          max_distance_km: 15
        })
      });

      const data = await response.json();
      setRouteData(data);
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Error calculating route');
    } finally {
      setLoading(false);
    }
  };

  const restaurant = restaurants.find(r => r.id === parseInt(selectedRestaurant));

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🗺️ Route Optimization
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Restaurant
            </label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Choose a restaurant</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surplus Amount (kg): {surplusAmount}
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={surplusAmount}
              onChange={(e) => setSurplusAmount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={handleCalculateRoute}
            disabled={loading || !selectedRestaurant}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? '🔄 Calculating...' : '🗺️ Calculate Optimal Route'}
          </button>

          {restaurant && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Starting Point
              </h3>
              <p className="text-sm text-gray-600">{restaurant.name}</p>
              <p className="text-xs text-gray-500">{restaurant.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                📍 {restaurant.latitude}, {restaurant.longitude}
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Available NGOs: {ngos.length}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ngos.map((ngo) => (
                <div key={ngo.id} className="bg-white p-3 rounded shadow-sm">
                  <p className="font-medium text-sm text-gray-800">
                    {ngo.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Capacity: {ngo.capacity_kg} kg/day
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {routeData ? (
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  Route Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-600">Total Distance</p>
                    <p className="text-2xl font-bold text-green-800">
                      {routeData.route_info?.total_distance_km || 0} km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Est. Time</p>
                    <p className="text-2xl font-bold text-green-800">
                      {routeData.route_info?.estimated_time_minutes || 0} min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Stops</p>
                    <p className="text-2xl font-bold text-green-800">
                      {routeData.matched_ngos?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Food Allocated</p>
                    <p className="text-2xl font-bold text-green-800">
                      {routeData.total_allocated_kg || 0} kg
                    </p>
                  </div>
                </div>
              </div>

              {routeData.matched_ngos && routeData.matched_ngos.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Delivery Route
                  </h3>
                  <div className="space-y-3">
                    {routeData.matched_ngos.map((ngo, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-0"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {ngo.ngo_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ngo.address}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-blue-600">
                              📍 {ngo.distance_km} km
                            </span>
                            <span className="text-green-600 font-semibold">
                              🍲 {ngo.allocated_kg} kg
                            </span>
                          </div>
                          {ngo.contact_person && (
                            <p className="text-xs text-gray-500 mt-1">
                              Contact: {ngo.contact_person}
                              {ngo.phone && ` • ${ngo.phone}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <p className="text-yellow-800">
                    ⚠️ No NGOs found within the specified distance range.
                    Try increasing the search radius or registering more NGOs.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <span className="text-6xl">🗺️</span>
              <p className="mt-4 text-gray-600">
                Select a restaurant and calculate the optimal delivery route
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;
