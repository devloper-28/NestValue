import React from "react";

export function NestValueIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Nest/Circle background */}
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="url(#nestGradient)"
          stroke="none"
        />
        
        {/* Dollar sign */}
        <path
          d="M16 6v2m0 16v2m-4-12h6a2 2 0 0 1 0 4h-6m6 0h-6a2 2 0 0 0 0 4h6"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Value bars */}
        <rect x="8" y="22" width="2" height="4" fill="white" opacity="0.8" rx="1"/>
        <rect x="11" y="20" width="2" height="6" fill="white" opacity="0.9" rx="1"/>
        <rect x="19" y="20" width="2" height="6" fill="white" opacity="0.9" rx="1"/>
        <rect x="22" y="22" width="2" height="4" fill="white" opacity="0.8" rx="1"/>
        
        <defs>
          <linearGradient id="nestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
