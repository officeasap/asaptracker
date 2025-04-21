
import React, { useRef, useEffect } from 'react';

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Set a slower playback rate when the video element is available
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.49; // Slows down to 49% of normal speed
    }
  }, []);

  return (
    <div className="video-container w-full left-0 right-0">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        id="homepage-video"
        className="video-element w-full"
      >
        <source
          src="https://res.cloudinary.com/daqofqxjr/video/upload/v1744425287/mzw7gebems1so9sjf9zi.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-dark via-dark/40 to-transparent z-10"></div>
    </div>
  );
};

export default VideoBackground;
