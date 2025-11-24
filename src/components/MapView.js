import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const restaurantIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjRUY0NDQ0IiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguMyAxMi41IDI4LjUgMTIuNSAyOC41czEyLjUtMjAuMiAxMi41LTI4LjVDMjUgNS42IDE5LjQgMCAxMi41IDB6bTAgMTcuNWMtMi44IDAtNS0yLjItNS01czIuMi01IDUtNSA1IDIuMiA1IDUtMi4yIDUtNSA1eiIvPjwvc3ZnPg==',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ngoIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjMTBCOTgxIiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguMyAxMi41IDI4LjUgMTIuNSAyOC41czEyLjUtMjAuMiAxMi41LTI4LjVDMjUgNS42IDE5LjQgMCAxMi41IDB6bTAgMTcuNWMtMi44IDAtNS0yLjItNS01czIuMi01IDUtNSA1IDIuMiA1IDUtMi4yIDUtNSA1eiIvPjwvc3ZnPg==',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapView = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [center, setCenter] = useState([11.1271, 78.6569]); // Tamil Nadu center

  useEffect(() => {
    fetchRestaurants();
    fetchNGOs();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const data = await response.json();
      if (data.restaurants && data.restaurants.length > 0) {
        setRestaurants(data.restaurants);
        setCenter([data.restaurants[0].latitude, data.restaurants[0].longitude]);
      }
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

  const showRoutes = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    try {
      const response = await fetch('http://localhost:5000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurant.id,
          surplus_kg: 25,
          max_distance_km: 15
        })
      });
      const data = await response.json();
      
      if (data.matched_ngos && data.matched_ngos.length > 0) {
        const routeLines = data.matched_ngos.map(ngo => ({
          positions: [
            [restaurant.latitude, restaurant.longitude],
            [ngo.latitude, ngo.longitude]
          ],
          ngo: ngo
        }));
        setRoutes(routeLines);
      }
    } catch (error) {
      console.error('Error calculating routes:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🗺️ Interactive Map View
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
            <MapContainer
              center={center}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {restaurants.map((restaurant) => (
                <Marker
                  key={`restaurant-${restaurant.id}`}
                  position={[restaurant.latitude, restaurant.longitude]}
                  icon={restaurantIcon}
                  eventHandlers={{
                    click: () => showRoutes(restaurant)
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-red-600">🏪 {restaurant.name}</h3>
                      <p className="text-sm text-gray-600">{restaurant.address}</p>
                      {restaurant.contact_person && (
                        <p className="text-xs text-gray-500 mt-1">
                          Contact: {restaurant.contact_person}
                        </p>
                      )}
                      <button
                        onClick={() => showRoutes(restaurant)}
                        className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Show Routes
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {ngos.map((ngo) => (
                <Marker
                  key={`ngo-${ngo.id}`}
                  position={[ngo.latitude, ngo.longitude]}
                  icon={ngoIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-green-600">🤝 {ngo.name}</h3>
                      <p className="text-sm text-gray-600">{ngo.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Capacity: {ngo.capacity_kg} kg/day
                      </p>
                      {ngo.operating_hours && (
                        <p className="text-xs text-gray-500">
                          Hours: {ngo.operating_hours}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {routes.map((route, index) => (
                <React.Fragment key={`route-${index}`}>
                  <Polyline
                    positions={route.positions}
                    color="#3B82F6"
                    weight={3}
                    opacity={0.7}
                    dashArray="10, 10"
                  />
                  <Circle
                    center={route.positions[1]}
                    radius={200}
                    fillColor="#10B981"
                    fillOpacity={0.2}
                    color="#10B981"
                    weight={1}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="text-red-500 mr-2">🏪</span>
              Restaurants ({restaurants.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => showRoutes(restaurant)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedRestaurant?.id === restaurant.id
                      ? 'bg-red-50 border-l-4 border-red-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800">
                    {restaurant.name}
                  </p>
                  <p className="text-xs text-gray-600">{restaurant.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="text-green-500 mr-2">🤝</span>
              NGOs ({ngos.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ngos.map((ngo) => (
                <div
                  key={ngo.id}
                  className="p-3 rounded bg-gray-50"
                >
                  <p className="font-semibold text-sm text-gray-800">
                    {ngo.name}
                  </p>
                  <p className="text-xs text-gray-600">{ngo.address}</p>
                  <p className="text-xs text-green-600 mt-1">
                    📦 {ngo.capacity_kg} kg/day
                  </p>
                </div>
              ))}
            </div>
          </div>

          {routes.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mt-4">
              <h4 className="font-bold text-blue-800 mb-2">
                Active Routes: {routes.length}
              </h4>
              <p className="text-sm text-blue-700">
                Click on restaurants to view distribution routes
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>💡 Map Legend:</strong> 🔴 Red markers = Restaurants | 🟢 Green markers = NGOs | 
          Blue dashed lines = Delivery routes | Click restaurant markers to show routes
        </p>
      </div>
    </div>
  );
};

export default MapView;
