import React from 'react';

interface DeviceMockupProps {
  image: string;
  alt?: string;
  className?: string;
}

const DeviceMockup: React.FC<DeviceMockupProps> = ({ image, alt = '', className = '' }) => {
  return (
    <div className={`relative flex justify-center items-center w-full max-w-2xl mx-auto ${className}`} style={{ perspective: '1200px' }}>
      {/* Glow effect */}
      <div className="absolute -inset-6 rounded-3xl blur-2xl opacity-60 z-0" style={{ background: 'radial-gradient(ellipse at center, #38bdf8 0%, #a78bfa 60%, transparent 100%)' }} />
      {/* Macbook SVG frame */}
      <svg viewBox="0 0 900 600" width="100%" height="auto" className="relative z-10" style={{ maxWidth: 900 }}>
        <defs>
          <clipPath id="screen-clip">
            <rect x="60" y="60" width="780" height="440" rx="24" />
          </clipPath>
        </defs>
        {/* Macbook body */}
        <rect x="40" y="40" width="820" height="520" rx="40" fill="#22272e" stroke="#444" strokeWidth="4" />
        {/* Screen border */}
        <rect x="60" y="60" width="780" height="440" rx="24" fill="#181c23" stroke="#444" strokeWidth="2" />
        {/* Screen content */}
        <image href={image} x="60" y="60" width="780" height="440" clipPath="url(#screen-clip)" preserveAspectRatio="xMidYMid slice" />
        {/* Camera dot */}
        <circle cx="450" cy="70" r="6" fill="#333" />
        {/* Bottom bar */}
        <rect x="200" y="520" width="500" height="20" rx="8" fill="#23272e" />
        {/* Trackpad */}
        <rect x="410" y="545" width="80" height="20" rx="6" fill="#2d323a" />
      </svg>
    </div>
  );
};

export default DeviceMockup; 