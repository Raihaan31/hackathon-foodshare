import React, { useState, useEffect, useCallback } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard');
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Restaurants',
      value: stats?.total_restaurants || 0,
      icon: '🏪',
      color: 'bg-blue-500'
    },
    {
      title: 'Total NGOs',
      value: stats?.total_ngos || 0,
      icon: '🤝',
      color: 'bg-purple-500'
    },
    {
      title: 'Food Distributed',
      value: `${stats?.total_distributed_kg || 0} kg`,
      icon: '🍲',
      color: 'bg-green-500'
    },
    {
      title: 'Meals Served',
      value: stats?.meals_served || 0,
      icon: '🍽️',
      color: 'bg-orange-500'
    },
    {
      title: 'CO₂ Saved',
      value: `${stats?.co2_saved_kg || 0} kg`,
      icon: '🌍',
      color: 'bg-teal-500'
    },
    {
      title: 'Predictions Made',
      value: stats?.total_predictions || 0,
      icon: '🔮',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4"
            style={{ borderLeftColor: card.color.replace('bg-', '') }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} rounded-full p-4 text-3xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Impact Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-100">Total Food Predicted:</span>
              <span className="font-bold text-xl">
                {stats?.total_predicted_kg || 0} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-100">Actual Surplus:</span>
              <span className="font-bold text-xl">
                {stats?.total_actual_kg || 0} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-100">Distribution Rate:</span>
              <span className="font-bold text-xl">
                {stats?.total_actual_kg > 0
                  ? Math.round((stats?.total_distributed_kg / stats?.total_actual_kg) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              📊 View Detailed Reports
            </button>
            <button className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              📧 Send Weekly Summary
            </button>
            <button className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              ⚙️ Configure Settings
            </button>
          </div>
        </div>
      </div>

      {stats && (stats.total_restaurants === 0 || stats.total_ngos === 0) && (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Getting Started
              </h3>
              <p className="mt-2 text-sm text-yellow-700">
                To start using the system, please register at least one restaurant
                and one NGO using the tabs above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
