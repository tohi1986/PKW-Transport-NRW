import Logo from "@/components/Logo";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";

const navItems = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Assistent", href: "#assistent" },
];

export default function Navbar() {
  return (
    <header className="relative z-50 shrink-0 border-b border-amber-500/30 bg-slate-950/25 backdrop-blur-md">
      <nav aria-label="Hauptnavigation">
        <div className="w-full px-3 min-[390px]:px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-1 py-2">
            <Logo />

            <div className="flex min-w-0 flex-nowrap items-center gap-1 min-[350px]:gap-2 sm:gap-5 lg:gap-10">
              {navItems.map((item, itemIndex) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="amber-letter-anim nav-link"
                  data-anim-target={`link${itemIndex + 1}`}
                >
                  {item.label.split("").map((char, charIndex) => (
                    <span
                      key={charIndex}
                      style={
                        {
                          "--char-index": charIndex,
                        } as React.CSSProperties
                      }
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </Link>
              ))}

              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
