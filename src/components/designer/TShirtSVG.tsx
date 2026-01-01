interface TShirtSVGProps {
  color?: string;
  view: 'front' | 'back';
  className?: string;
}

export function TShirtSVG({ color = '#FFFFFF', view, className = '' }: TShirtSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 500"
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        {/* Shadow filter */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
          <feOffset dx="0" dy="8" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Fabric texture pattern */}
        <pattern id="fabric" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="4" height="4" fill={color} opacity="0.98"/>
          <circle cx="1" cy="1" r="0.3" fill="#000" opacity="0.02"/>
          <circle cx="3" cy="3" r="0.3" fill="#000" opacity="0.02"/>
        </pattern>

        {/* Gradient for depth */}
        <linearGradient id="shading" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1"/>
          <stop offset="50%" stopColor="#000000" stopOpacity="0"/>
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15"/>
        </linearGradient>
      </defs>

      {/* T-shirt body with shadow */}
      <g id="tshirt" filter="url(#shadow)">
        {/* Main body */}
        <path
          d="M 100 80 L 120 60 L 140 60 L 160 80 L 240 80 L 260 60 L 280 60 L 300 80 L 300 400 L 250 420 L 150 420 L 100 400 Z"
          fill="url(#fabric)"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Shading overlay */}
        <path
          d="M 100 80 L 120 60 L 140 60 L 160 80 L 240 80 L 260 60 L 280 60 L 300 80 L 300 400 L 250 420 L 150 420 L 100 400 Z"
          fill="url(#shading)"
        />

        {/* Left sleeve */}
        <path
          d="M 100 80 L 60 100 L 60 160 L 90 150 L 100 120 Z"
          fill="url(#fabric)"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 100 80 L 60 100 L 60 160 L 90 150 L 100 120 Z"
          fill="url(#shading)"
        />

        {/* Right sleeve */}
        <path
          d="M 300 80 L 340 100 L 340 160 L 310 150 L 300 120 Z"
          fill="url(#fabric)"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 300 80 L 340 100 L 340 160 L 310 150 L 300 120 Z"
          fill="url(#shading)"
        />

        {/* Collar - V-neck style */}
        <path
          d="M 160 80 L 180 70 L 200 85 L 220 70 L 240 80 L 220 88 L 200 95 L 180 88 Z"
          fill={color}
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Collar inner shadow */}
        <path
          d="M 180 70 L 200 85 L 220 70"
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
          opacity="0.2"
        />

        {/* Seam lines for realistic detail */}
        <line x1="165" y1="85" x2="165" y2="395" stroke="#1a1a1a" strokeWidth="1" opacity="0.15" strokeDasharray="3,2" />
        <line x1="235" y1="85" x2="235" y2="395" stroke="#1a1a1a" strokeWidth="1" opacity="0.15" strokeDasharray="3,2" />
        
        {/* Hem lines */}
        <path
          d="M 150 415 Q 200 418 250 415"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Sleeve hems */}
        <line x1="60" y1="158" x2="90" y2="148" stroke="#1a1a1a" strokeWidth="1" opacity="0.2" />
        <line x1="310" y1="148" x2="340" y2="158" stroke="#1a1a1a" strokeWidth="1" opacity="0.2" />
      </g>
    </svg>
  );
}
