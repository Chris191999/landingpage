
import React from 'react';

const AuthHeader = React.memo(() => {
  return (
    <div className="flex flex-col items-center gap-2 pb-2">
      <img
        src="/THT-Trademind LOGO resized .png"
        alt="Logo"
        className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-lg mx-auto bg-gray-900"
        loading="eager"
      />
      <div className="text-center mt-2">
        <div className="text-lg font-bold tracking-wide text-[#872bdb]">The House of Traders</div>
        <div className="text-2xl font-extrabold drop-shadow-sm text-[#f5dd01]">Trademind</div>
        <div className="text-xs text-gray-300 mt-1">The Holy App for Traders</div>
      </div>
    </div>
  );
});

AuthHeader.displayName = 'AuthHeader';

export default AuthHeader;
