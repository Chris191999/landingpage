import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StreamerModeContextType {
  streamerMode: boolean;
  setStreamerMode: (v: boolean) => void;
}

const StreamerModeContext = createContext<StreamerModeContextType>({ streamerMode: false, setStreamerMode: () => {} });

export const useStreamerMode = () => useContext(StreamerModeContext);

export const StreamerModeProvider = ({ children }: { children: ReactNode }) => {
  const [streamerMode, setStreamerMode] = useState(() => {
    const stored = localStorage.getItem('streamerMode');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('streamerMode', streamerMode ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('streamerModeChange', { detail: { streamerMode } }));
  }, [streamerMode]);

  return (
    <StreamerModeContext.Provider value={{ streamerMode, setStreamerMode }}>
      {children}
    </StreamerModeContext.Provider>
  );
}; 