
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the user tried to access the old /live-tracker URL
  const isLiveTrackerAttempt = location.pathname.includes("live-tracker") && !location.pathname.includes("live-flight-tracker");

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-purple">404</h1>
        <p className="text-2xl text-gray-light mb-6">Oops! Page not found</p>
        
        {isLiveTrackerAttempt && (
          <div className="mb-6 p-4 bg-purple/10 rounded-lg">
            <p className="mb-2">Looking for the flight tracker?</p>
            <p className="text-sm mb-4">The correct URL is <span className="font-mono text-purple">/live-flight-tracker</span></p>
            <button 
              onClick={() => navigate("/live-flight-tracker")}
              className="inline-flex items-center px-4 py-2 bg-purple hover:bg-purple/80 text-white rounded-md transition-colors"
            >
              Go to Flight Tracker
            </button>
          </div>
        )}
        
        <button 
          onClick={() => navigate("/")}
          className="inline-flex items-center text-purple hover:text-purple/80 underline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
