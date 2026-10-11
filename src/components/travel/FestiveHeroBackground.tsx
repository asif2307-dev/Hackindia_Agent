import React from 'react';

export const FestiveHeroBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: "url('/images/beach-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle soft translucent gradient overlay ensuring crisp typography contrast while preserving the vibrant beach scenery */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-black/15 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-20 w-full pt-6 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};
