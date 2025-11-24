import React, { useState } from 'react';

const PredictionForm = ({ restaurants }) => {
  const [formData, setFormData] = useState({
    restaurant_id: '',
    day_of_week: new Date().getDay(),
    meal_type: 'lunch',
    previous_waste_kg: '',
    weather: 'sunny',
    special_event: 0,
    customer_count: 150,
    temperature: 22
  });

  const [prediction, setPrediction] = useState(null);
  const [matching, setMatching] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setMatching(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setPrediction(data.prediction);

      if (data.prediction.predicted_surplus_kg > 5) {
        const matchResponse = await fetch('http://localhost:5000/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurant_id: formData.restaurant_id,
            surplus_kg: data.prediction.predicted_surplus_kg,
            max_distance_km: 10
          })
        });

        const matchData = await matchResponse.json();
        setMatching(matchData);
      }
    } catch (error) {
      console.error('Error predicting surplus:', error);
      alert('Error making prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🔮 Predict Food Surplus
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant
              </label>
              <select
                name="restaurant_id"
                value={formData.restaurant_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} - {r.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week
                </label>
                <select
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  name="meal_type"
                  value={formData.meal_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Waste (kg)
              </label>
              <input
                type="number"
                name="previous_waste_kg"
                value={formData.previous_waste_kg}
                onChange={handleChange}
                step="0.1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 15.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weather
                </label>
                <select
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="sunny">☀️ Sunny</option>
                  <option value="rainy">🌧️ Rainy</option>
                  <option value="cloudy">☁️ Cloudy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Customers
              </label>
              <input
                type="number"
                name="customer_count"
                value={formData.customer_count}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="special_event"
                checked={formData.special_event === 1}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Special Event (Holiday/Promotion)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? '🔄 Predicting...' : '🔮 Predict Surplus'}
            </button>
          </form>
        </div>

        <div>
          {prediction && (
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  Prediction Results
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Predicted Surplus
                    </p>
                    <p className="text-4xl font-bold text-green-800">
                      {prediction.predicted_surplus_kg} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Confidence
                    </p>
                    <p className="text-lg font-semibold text-green-700 capitalize">
                      {prediction.confidence}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-green-800">
                      💡 {prediction.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {matching && matching.matched_ngos && matching.matched_ngos.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">
                    Matched NGOs ({matching.matched_ngos.length})
                  </h3>
                  <div className="space-y-3">
                    {matching.matched_ngos.map((ngo, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow">
                        <p className="font-semibold text-gray-800">
                          {ngo.ngo_name}
                        </p>
                        <p className="text-sm text-gray-600">{ngo.address}</p>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-blue-600">
                            📍 {ngo.distance_km} km away
                          </span>
                          <span className="text-green-600 font-semibold">
                            {ngo.allocated_kg} kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {matching.route_info && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-sm text-blue-800">
                        🚗 Total Distance: {matching.route_info.total_distance_km} km
                      </p>
                      <p className="text-sm text-blue-800">
                        ⏱️ Estimated Time: {matching.route_info.estimated_time_minutes} minutes
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!prediction && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <span className="text-6xl">🔮</span>
              <p className="mt-4 text-gray-600">
                Fill in the form to predict food surplus
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
