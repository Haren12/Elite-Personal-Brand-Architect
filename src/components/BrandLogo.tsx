import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'h-14 w-14',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`} id="brand-logo-container">
      {/* Ambient background glow effect */}
      <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-md -z-10 animate-pulse" />
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="brand-logo-svg"
      >
        {/* Outer Hexagonal Shield Frame - Vibrant Indigo stroke with semi-transparent Indigo-950 fill */}
        <path
          d="M50 8 L88 30 L88 70 L50 92 L12 70 L12 30 Z"
          fill="#0c0a09" /* Deep matching neutral background */
          stroke="#6366f1" /* Indigo 500 */
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Inner Tech-Mesh Hexagon Background Grid lines */}
        <path
          d="M50 8 L50 92 M12 30 L88 70 M12 70 L88 30"
          stroke="#4f46e5" /* Indigo 600 */
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.5"
        />

        {/* Stylized Interlocking 'H' & 'L' */}
        {/* Left Column of H - Pure White for maximum contrast */}
        <path
          d="M34 28 L34 72"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Horizontal Crossbar of H - Pure White */}
        <path
          d="M34 50 L58 50"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Right Column of H + Vertical Stem of L - Bright Sky Blue */}
        <path
          d="M58 28 L58 72"
          stroke="#38bdf8" /* Sky 400 */
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Bottom Horizontal Base of L - Bright Sky Blue */}
        <path
          d="M58 72 L76 72"
          stroke="#38bdf8" /* Sky 400 */
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Dynamic Spark / Digital Node */}
        <circle
          cx="76"
          cy="28"
          r="5"
          className="animate-pulse"
          fill="#38bdf8"
        />
      </svg>
    </div>
  );
}
