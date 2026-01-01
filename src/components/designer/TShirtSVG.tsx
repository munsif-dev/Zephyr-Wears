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
      {/* T-shirt body */}
      <g id="tshirt">
        {/* Main body */}
        <path
          d="M 100 80 L 120 60 L 140 60 L 160 80 L 240 80 L 260 60 L 280 60 L 300 80 L 300 400 L 250 420 L 150 420 L 100 400 Z"
          fill={color}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Left sleeve */}
        <path
          d="M 100 80 L 60 100 L 60 160 L 90 150 L 100 120 Z"
          fill={color}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Right sleeve */}
        <path
          d="M 300 80 L 340 100 L 340 160 L 310 150 L 300 120 Z"
          fill={color}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Collar */}
        <path
          d="M 160 80 L 180 70 L 220 70 L 240 80 L 220 90 L 180 90 Z"
          fill={color}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Design area highlight */}
        {view === 'front' && (
          <>
            {/* Chest area box */}
            <rect
              x="150"
              y="140"
              width="100"
              height="100"
              fill="none"
              stroke="#999"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.5"
            />
            <text x="200" y="265" fontSize="12" fill="#666" textAnchor="middle">
              CHEST AREA
            </text>
          </>
        )}

        {view === 'back' && (
          <>
            {/* Back area box */}
            <rect
              x="150"
              y="150"
              width="100"
              height="120"
              fill="none"
              stroke="#999"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.5"
            />
            <text x="200" y="290" fontSize="12" fill="#666" textAnchor="middle">
              BACK AREA
            </text>
          </>
        )}
      </g>

      {/* View label */}
      <text
        x="200"
        y="30"
        fontSize="20"
        fontWeight="bold"
        fill="#333"
        textAnchor="middle"
      >
        {view.toUpperCase()} VIEW
      </text>

      {/* Seam lines for detail */}
      <line x1="160" y1="80" x2="160" y2="400" stroke="#999" strokeWidth="0.5" opacity="0.3" />
      <line x1="240" y1="80" x2="240" y2="400" stroke="#999" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}
