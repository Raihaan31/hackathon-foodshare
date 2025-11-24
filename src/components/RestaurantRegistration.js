import React, { useState } from 'react';

const RestaurantRegistration = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    contact_person: '',
    phone: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          address: '',
          latitude: '',
          longitude: '',
          contact_person: '',
          phone: '',
          email: ''
        });
        if (onSuccess) onSuccess();
        
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert('Error registering restaurant');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registering restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🏪 Register Restaurant
      </h2>

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-800 font-semibold">
            ✅ Restaurant registered successfully!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Green Bistro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 123 Main Street, City"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 40.7128"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person
          </label>
          <input
            type="text"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., +1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., contact@restaurant.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? '⏳ Registering...' : '✅ Register Restaurant'}
        </button>
      </form>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> You can use Google Maps to find the exact latitude
          and longitude of your restaurant location.
        </p>
      </div>
    </div>
  );
};

export default RestaurantRegistration;
