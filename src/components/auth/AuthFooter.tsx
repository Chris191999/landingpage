import React from 'react';
import { Mail } from 'lucide-react';

const AuthFooter = React.memo(() => {
  return (
    <div className="mt-8 border-t border-white/20 pt-4 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm text-gray-300">Contact Us</span>
        <a 
          href="mailto:Thehouseoftraders69@gmail.com" 
          className="flex items-center gap-1 text-yellow-400 hover:underline text-sm"
        >
          <Mail size={16} className="inline-block" /> 
          Thehouseoftraders69@gmail.com
        </a>
        <a
          href="https://discord.gg/fqQSQnpbB4"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-200 transition-colors duration-300 text-sm font-semibold"
        >
          <img 
            src="/discord-server.png" 
            alt="Discord" 
            className="w-4 h-4 inline-block rounded-full bg-gray-800" 
            style={{ filter: 'drop-shadow(0 1px 2px #0008)' }} 
          />
          Join our Discord Community
        </a>
      </div>
    </div>
  );
});

AuthFooter.displayName = 'AuthFooter';

export default AuthFooter;
