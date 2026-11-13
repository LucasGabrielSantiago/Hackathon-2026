// Ícones de traço (outline) 24px, cor herdada do texto. Ver Design System > Iconografia.
const PATHS = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  wallet: <><path d="M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4z" /><path d="M4 7l11-3v3" /><circle cx="16" cy="13" r="1.2" /></>,
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  box: <><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  coin: <><circle cx="12" cy="12" r="8" /><path d="M14.5 9.5c-.5-.8-1.4-1.2-2.5-1.2-1.6 0-2.7.8-2.7 1.9 0 2.6 5.4 1.3 5.4 3.9 0 1.1-1.2 1.9-2.7 1.9-1.2 0-2.2-.5-2.7-1.4M12 6.5v1.8M12 15.7v1.8" /></>,
  scan: <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" />,
  check: <path d="M5 12l5 5 9-10" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  logout: <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l4-4-4-4M14 12H4" />,
  recycle: <path d="M7 19H4l3.5-6M17 19h3l-3.5-6M12 4l2 3.5M12 4l-2 3.5M9 19h6M8.5 9.5L12 4l3.5 5.5" />,
};

export default function Icon({ name, className = 'ico', label }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>
      {PATHS[name]}
    </svg>
  );
}
