import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../public/Animation.json';
import MarkerItem from './MarkerItem';

const containerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: 10,
};

function GoogleMapSection({ coordinates, listing }) {
  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',

    googleMapsApiOptions: {
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
        'x-rapidapi-host': 'google-maps-geocoding.p.rapidapi.com',
      },
    },
  });

  const [map, setMap] = useState(null);

  useEffect(() => {
    if (coordinates) {
      setCenter(coordinates);
    }
  }, [coordinates]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, [center]);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {listing?.map((item, index) => (
            <MarkerItem key={index} item={item} />
          ))}
        </GoogleMap>
      ) : (
        <div className='flex justify-center'>
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
      )}
    </div>
  );
}

export default GoogleMapSection;
