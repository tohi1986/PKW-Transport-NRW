
export default function CallButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <a
        href="tel:+491772215875"
        aria-label="Anrufen"
        className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-cyan-400 border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(245,158,11,0.9)] backdrop-blur-md transition-all duration-300 hover:bg-slate-900 hover:scale-110 active:scale-95"
      >
        <span className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden rounded-xl">
          <span className="h-6 w-6 rounded-full border border-cyan-500 animate-radar-ping" />
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 h-7 w-7 animate-[spin_10s_linear_infinite_reverse] [animation-delay:0.3s] sm:h-8 sm:w-8"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.74 2.04Z" />
        </svg>
      </a>
    </div>
  );
}
