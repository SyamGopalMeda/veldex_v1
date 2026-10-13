/**
 * Static CAD-style elevation of a sliding gate with dimension lines — the
 * "Measure" stage of the process reel. Lines draw themselves via CSS
 * (`.vx-bp-draw`) when the parent reel stage becomes current.
 */
export function BlueprintVisual() {
  const bars = Array.from({ length: 11 }, (_, i) => 70 + i * 26);
  return (
    <div className="vx-bp" role="img" aria-label="CAD elevation drawing of a sliding gate with dimension lines">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="vx-bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#vx-bp-grid)" />
        <g className="vx-bp-draw" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3">
          {/* frame */}
          <path d="M 60 80 H 340 V 230 H 60 Z" />
          <path d="M 60 104 H 340 M 60 206 H 340" />
          {/* infill bars */}
          {bars.map((x) => <path key={x} d={`M ${x} 104 V 206`} strokeWidth="0.9" />)}
          {/* posts + track */}
          <path d="M 48 64 V 244 M 352 64 V 244" strokeWidth="2" />
          <path d="M 30 250 H 370" strokeDasharray="6 4" />
        </g>
        <g className="vx-bp-dims" stroke="#F3AF04" strokeWidth="0.9" fill="none">
          <path d="M 60 50 H 340 M 60 44 V 56 M 340 44 V 56" />
          <path d="M 370 80 V 230 M 364 80 H 376 M 364 230 H 376" />
        </g>
        <g className="vx-bp-dims" fill="#F3AF04" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="1">
          <text x="200" y="40" textAnchor="middle">W · ON-SITE CAD</text>
          <text x="386" y="158" textAnchor="middle" transform="rotate(90 386 158)">H</text>
        </g>
      </svg>
    </div>
  );
}
