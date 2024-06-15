const MySvgComponent = () => (
  <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg">
    <mask id="rv" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
      <rect width="36" height="36" rx="72" fill="#FFFFFF" />
    </mask>
    <g mask="url(#rv)">
      <rect width="36" height="36" fill="#49007e" />
      <rect
        x="0"
        y="0"
        width="36"
        height="36"
        transform="translate(7 1) rotate(353 18 18) scale(1.2)"
        fill="#ff7d10"
        rx="6"
      />
      <g transform="translate(3.5 -1) rotate(-3 18 18)">
        <path d="M15 21c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round" />
        <rect x="11" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
        <rect x="23" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
      </g>
    </g>
  </svg>
);

export default MySvgComponent;
