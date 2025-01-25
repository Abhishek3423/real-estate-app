import React, { useState } from 'react';
import { MapPinned } from 'lucide-react';
import { toast } from 'sonner';
function GoogleAddressSearch({ selectedAddress, setCoordinates }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (query) => {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(`https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&language=en`, options);
      const result = await response.json();
      setSuggestions(result.predictions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectSuggestion = async (description) => {
    setSearchQuery(description);
    setShowSuggestions(false);

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(`https://google-map-places.p.rapidapi.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(description)}&inputtype=textquery&fields=formatted_address,geometry&language=en`, options);
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const place = result.candidates[0];
        selectedAddress(place.formatted_address);
        setCoordinates(place.geometry.location);
      }
    } catch (error) {
      console.error();
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative flex gap-2 items-center">
      <MapPinned className='w-auto h-auto' />
      <input

        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search Property Address"
        className="p-2 border rounded w-full"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full max-h-60 overflow-y-auto mt-2 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectSuggestion(suggestion.description)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GoogleAddressSearch;
