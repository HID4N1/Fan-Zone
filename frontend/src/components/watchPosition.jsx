import { useEffect } from 'react';

const WatchPosition = ({ onLocationDetected, onError }) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        console.log('WatchPosition: position updated', pos);
        const { latitude, longitude } = pos.coords;
        onLocationDetected({ lat: latitude, lng: longitude });
      },
      err => {
        console.error('WatchPosition: error obtaining position', err);
        onError(err.message);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onLocationDetected, onError]);

  return null;
};

export default WatchPosition;
