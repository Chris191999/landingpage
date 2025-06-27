
import React from 'react';

const AuthBackground = React.memo(() => {
  return (
    <div className="absolute inset-0">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/25 to-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-yellow-400/20 to-orange-500/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-tl from-emerald-500/20 to-teal-400/25 rounded-full blur-3xl animate-pulse delay-3000"></div>
      
      {/* Moving light streaks */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent transform rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent transform -rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent transform rotate-6 animate-pulse delay-2000"></div>
      </div>
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
    </div>
  );
});

AuthBackground.displayName = 'AuthBackground';

export default AuthBackground;
