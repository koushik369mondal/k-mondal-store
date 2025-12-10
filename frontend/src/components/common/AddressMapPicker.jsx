import React, { useState, useCallback, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const AddressMapPicker = ({ onLocationSelect, initialLocation }) => {
    const [viewport, setViewport] = useState({
        latitude: initialLocation?.latitude || 22.5726,
        longitude: initialLocation?.longitude || 88.3639,
        zoom: 12
    });
    const [marker, setMarker] = useState(
        initialLocation || { latitude: 22.5726, longitude: 88.3639 }
    );
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // Reverse geocode to get address from coordinates
    const reverseGeocode = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
            );
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const place = data.features[0];
                const formattedAddress = place.place_name;
                setAddress(formattedAddress);

                // Extract city, state, pincode from the response
                let city = '';
                let state = '';
                let pincode = '';

                place.context?.forEach(item => {
                    if (item.id.includes('place')) city = item.text;
                    if (item.id.includes('region')) state = item.text;
                    if (item.id.includes('postcode')) pincode = item.text;
                });

                return { formattedAddress, city, state, pincode };
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        } finally {
            setLoading(false);
        }
        return null;
    };

    // Handle map click to set marker
    const handleMapClick = useCallback(async (event) => {
        const { lngLat } = event;
        const newMarker = {
            latitude: lngLat.lat,
            longitude: lngLat.lng
        };

        setMarker(newMarker);

        const addressData = await reverseGeocode(lngLat.lat, lngLat.lng);
        if (addressData && onLocationSelect) {
            onLocationSelect({
                ...newMarker,
                ...addressData
            });
        }
    }, [onLocationSelect]);

    // Get user's current location
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const newMarker = { latitude, longitude };

                    setMarker(newMarker);
                    setViewport(prev => ({
                        ...prev,
                        latitude,
                        longitude,
                        zoom: 14
                    }));

                    const addressData = await reverseGeocode(latitude, longitude);
                    if (addressData && onLocationSelect) {
                        onLocationSelect({
                            ...newMarker,
                            ...addressData
                        });
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please select manually on the map.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    useEffect(() => {
        if (initialLocation) {
            reverseGeocode(initialLocation.latitude, initialLocation.longitude);
        }
    }, [initialLocation]);

    return (
        <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
                <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-xl hover:bg-primary-light transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Use Current Location
                </button>

                {loading && (
                    <span className="flex items-center gap-2 text-gray-600">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading address...
                    </span>
                )}
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-cream-dark shadow-lg" style={{ height: '400px' }}>
                <Map
                    {...viewport}
                    onMove={evt => setViewport(evt.viewState)}
                    onClick={handleMapClick}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                >
                    {marker && (
                        <Marker
                            latitude={marker.latitude}
                            longitude={marker.longitude}
                            anchor="bottom"
                        >
                            <div className="relative">
                                <svg
                                    className="w-10 h-10 text-red-600 drop-shadow-lg animate-bounce"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0C7.802 0 4.403 3.403 4.403 7.602c0 1.7.6 3.3 1.6 4.6L12 24l5.997-11.798c1-1.3 1.6-2.9 1.6-4.6C19.597 3.403 16.198 0 12 0zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                                </svg>
                            </div>
                        </Marker>
                    )}

                    <NavigationControl position="top-right" />
                    <GeolocateControl position="top-right" />
                </Map>

                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t-2 border-cream-dark">
                    <p className="text-sm font-semibold text-charcoal mb-1">📍 Selected Location:</p>
                    {address ? (
                        <p className="text-sm text-gray-700">{address}</p>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Click on the map to select a location</p>
                    )}
                </div>
            </div>

            <div className="bg-cream/50 rounded-xl p-4 border border-cream-dark">
                <p className="text-sm text-gray-700">
                    <strong>💡 Tip:</strong> Click anywhere on the map to set your delivery location, or use "Use Current Location" button to auto-detect your position.
                </p>
            </div>
        </div>
    );
};

export default AddressMapPicker;
