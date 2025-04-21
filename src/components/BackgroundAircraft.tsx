
import React from 'react';

const BackgroundAircraft = () => {
  return (
    <div className="fixed pointer-events-none overflow-hidden w-full h-full top-0 left-0 -z-10">
      <div className="absolute right-[5%] top-[20%] w-[450px] floating-aircraft">
        <img 
          src="/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png" 
          alt="" 
          className="w-full h-auto opacity-20"
        />
      </div>
    </div>
  );
};

export default BackgroundAircraft;
