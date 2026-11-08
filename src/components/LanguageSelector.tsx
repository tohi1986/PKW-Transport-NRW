
import Image from "next/image";

const flags = [
  { src: "/images/flags/german_flag.svg", alt: "Deutsch" },
  { src: "/images/flags/turkish_flag.svg", alt: "Türkçe" },
  { src: "/images/flags/arabic_language.svg", alt: "العربية" },
  { src: "/images/flags/polish_flag.svg", alt: "Polski" },
  { src: "/images/flags/uk_flag.svg", alt: "English" },
];

const reelFlags = [...flags, flags[0]];

export default function LanguageSelector() {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Sprachauswahl"
        title="Verfügbare Sprachen"
        className="
          group relative flex h-8 w-8 shrink-0
          items-center justify-center
          transition-transform duration-300
          hover:scale-110 active:scale-95
          min-[350px]:h-9 min-[350px]:w-9
          min-[390px]:h-10 min-[390px]:w-10
          sm:h-11 sm:w-11
          lg:h-12 lg:w-12
          motion-reduce:transition-none
        "
      >
        <div className="relative h-full w-full overflow-hidden">
          <div
            aria-hidden="true"
            className="
              language-reel
              pointer-events-none
              absolute left-0 top-0
              flex h-full w-full flex-col
            "
          >
            {reelFlags.map((flag, index) => (
              <div
                key={`${flag.src}-${index}`}
                className="
                  flex h-full w-full shrink-0
                  items-center justify-center
                "
              >
                <Image
                  src={flag.src}
                  alt=""
                  width={36}
                  height={24}
                  unoptimized
                  className="
                    h-4 w-6 rounded-sm object-cover
                    shadow-[0_0_10px_rgba(245,158,11,0.3)]
                    min-[350px]:h-4.5 min-[350px]:w-6.75
                    min-[390px]:h-5 min-[390px]:w-7.5
                    sm:h-5.5 sm:w-8.25
                    lg:h-6 lg:w-9
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </button>
    </div>
  );
}
