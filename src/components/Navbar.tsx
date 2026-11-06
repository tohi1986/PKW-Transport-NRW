import Logo from "@/components/Logo";
import Link from "next/link";

const navItems = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Assistent", href: "#assistent" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-amber-500/20 bg-black/25 backdrop-blur-md">
      <nav aria-label="Hauptnavigation">
        <div className="w-full px-3 min-[390px]:px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-1 py-2">
            <Logo />

            <div className="flex min-w-0 flex-nowrap items-center gap-2 min-[350px]:gap-3 sm:gap-5 lg:gap-10">
              {navItems.map((item, navIndex) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={
                    {
                      "--element-delay": `${navIndex * 5}s`,
                    } as React.CSSProperties
                  }
                  className="amber-letter-anim inline-block scale-y-130 sm:scale-y-100 whitespace-nowrap font-(family-name:--font-barlow) text-xs font-extrabold uppercase tracking-tight transition-colors duration-200 min-[350px]:text-sm min-[390px]:text-base sm:text-2xl lg:text-3xl"
                >
                  {item.label.split("").map((char, index) => (
                    <span
                      key={index}
                      style={
                        {
                          "--char-index": index,
                        } as React.CSSProperties
                      }
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </Link>
              ))}

              {/* Klikabilni okvir za zastavicu / izbornik jezika */}
              <button
                type="button"
                aria-label="Sprachauswahl"
                className="group flex shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-slate-950/80 px-2.5 py-1 text-base shadow-[0_0_10px_rgba(6,182,212,0.2)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95 sm:px-3 sm:py-1.5 sm:text-xl"
              >
                <span className="transition-transform duration-200 group-hover:scale-110" role="img" aria-label="Deutsch">
                  🇩🇪
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}