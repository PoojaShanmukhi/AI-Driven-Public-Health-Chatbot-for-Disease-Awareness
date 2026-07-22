import React, { useEffect, useState } from 'react';
import ChatInterface from './components/ChatInterface';
import DisclaimerModal from './components/DisclaimerModal';
import { LocationData } from './types';

const App: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Request location on mount to be ready for user queries
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.warn("Location access denied or error:", error);
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="w-full h-[90vh] md:h-[85vh]">
        <ChatInterface location={location} locationError={locationError} />
      </div>
      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />
    </div>
  );
};

export default App;
