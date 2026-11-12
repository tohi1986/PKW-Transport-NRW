
import Logo from "@/components/Logo";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslations, useLocale } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const navItems = [
    { label: t("services"), href: "#leistungen" },
    { label: t("assistant"), href: "#assistent" },
  ];

  return (
    <header className="relative z-50 shrink-0 border-b border-amber-400/50 bg-slate-950/25 backdrop-blur-md">
      <nav aria-label={t("navigationLabel")}>
        <div className="w-full px-3 min-[390px]:px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-12 items-center justify-between gap-1 pt-0.5">
            <Logo />

            <div className="flex min-w-0 flex-nowrap items-center gap-1 min-[350px]:gap-2 sm:gap-5 lg:gap-10">
              {navItems.map((item, itemIndex) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className="amber-letter-anim nav-link"
                  data-anim-target={`link${itemIndex + 1}`}
                >
                  {locale === "ar" ? (
                    <span
                      style={
                        {
                          "--char-index": 0,
                        } as React.CSSProperties
                      }
                    >
                      {item.label}
                    </span>
                  ) : (
                    item.label.split("").map((char, charIndex) => (
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
                    ))
                  )}
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
