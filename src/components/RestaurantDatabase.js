import React, { useState, useEffect } from 'react';

const RestaurantDatabase = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const data = await response.json();
      setRestaurants(data.restaurants || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setLoading(false);
    }
  };

  const fetchRestaurantLogs = async (restaurantId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/logs?restaurant_id=${restaurantId}`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchRestaurantLogs(restaurant.id);
  };

  const deleteRestaurant = async (restaurantId) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }
    alert('Delete functionality requires backend endpoint implementation');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Restaurant Database
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">
                All Restaurants ({restaurants.length})
              </h3>
              <button
                onClick={fetchRestaurants}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                🔄 Refresh
              </button>
            </div>

            {restaurants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No restaurants registered</p>
                <p className="text-sm mt-2">Register one using the form</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => handleSelectRestaurant(restaurant)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedRestaurant?.id === restaurant.id
                        ? 'bg-green-50 border-2 border-green-500 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">
                          {restaurant.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {restaurant.address}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📧 {restaurant.email || 'No email'}
                        </p>
                        <p className="text-xs text-gray-500">
                          📞 {restaurant.phone || 'No phone'}
                        </p>
                      </div>
                      <span className="text-2xl">🏪</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedRestaurant ? (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedRestaurant.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <strong>Address:</strong> {selectedRestaurant.address}
                      </p>
                      <p className="text-gray-600">
                        <strong>Coordinates:</strong> {selectedRestaurant.latitude}, {selectedRestaurant.longitude}
                      </p>
                      {selectedRestaurant.contact_person && (
                        <p className="text-gray-600">
                          <strong>Contact:</strong> {selectedRestaurant.contact_person}
                        </p>
                      )}
                      {selectedRestaurant.phone && (
                        <p className="text-gray-600">
                          <strong>Phone:</strong> {selectedRestaurant.phone}
                        </p>
                      )}
                      {selectedRestaurant.email && (
                        <p className="text-gray-600">
                          <strong>Email:</strong> {selectedRestaurant.email}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs">
                        <strong>Registered:</strong> {new Date(selectedRestaurant.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => window.open(`https://maps.google.com/?q=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`, '_blank')}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      📍 View on Map
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Food Waste History ({logs.length} records)
                </h4>

                {logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No prediction history for this restaurant</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Meal
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Previous Waste
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Predicted
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actual
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                              {log.meal_type}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {log.previous_waste_kg} kg
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                              {log.predicted_surplus_kg ? `${log.predicted_surplus_kg} kg` : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                              {log.actual_surplus_kg ? `${log.actual_surplus_kg} kg` : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                log.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-blue-600 font-medium">Total Predicted</p>
                        <p className="text-xl font-bold text-blue-800">
                          {logs.reduce((sum, log) => sum + (log.predicted_surplus_kg || 0), 0).toFixed(2)} kg
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-green-600 font-medium">Total Actual</p>
                        <p className="text-xl font-bold text-green-800">
                          {logs.reduce((sum, log) => sum + (log.actual_surplus_kg || 0), 0).toFixed(2)} kg
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <p className="text-xs text-purple-600 font-medium">Accuracy</p>
                        <p className="text-xl font-bold text-purple-800">
                          {logs.filter(l => l.predicted_surplus_kg && l.actual_surplus_kg).length > 0
                            ? Math.round((1 - Math.abs(
                                logs.reduce((sum, log) => sum + (log.predicted_surplus_kg || 0), 0) -
                                logs.reduce((sum, log) => sum + (log.actual_surplus_kg || 0), 0)
                              ) / logs.reduce((sum, log) => sum + (log.actual_surplus_kg || 1), 0)) * 100)
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <span className="text-6xl">🏪</span>
              <p className="mt-4 text-gray-600">
                Select a restaurant from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDatabase;
