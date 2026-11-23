import { useTranslations } from "next-intl";
import type { ServiceItem } from "./services.data";

type ServiceCardProps = {
  service: ServiceItem;
  index: number;
};

export default function ServiceCard({
  service,
  index,
}: ServiceCardProps) {
  const t = useTranslations("Services");
  const Icon = service.icon;
  const revealDelay = `${index * 180}ms`;

  return (
    <article
      data-reveal
      data-visible="false"
      style={{
        transitionDelay: revealDelay,
      }}
      className={`
        group
        translate-y-12
        transition-transform
        duration-1000
        ease-out
        data-[visible=true]:translate-y-0
        motion-reduce:translate-y-0
        motion-reduce:transition-none

        lg:w-[48%]
        ${
          index % 2 === 0
            ? "lg:self-start"
            : "lg:self-end"
        }
      `}
    >
      {/* GLASS CARD - SMOOTH FADE */}
      <div
        className="
          relative
          h-full
          overflow-hidden
          rounded-2xl
          border border-amber-400/30
          bg-slate-950/25
          shadow-lg shadow-black/15

          before:pointer-events-none
          before:absolute
          before:inset-0
          before:rounded-[inherit]
          before:content-['']
          before:bg-slate-950/10
          before:backdrop-blur-md
          before:opacity-0
          before:transition-opacity
          before:duration-1000
          before:ease-out
          group-data-[visible=true]:before:opacity-100
          motion-reduce:before:opacity-100

          transition-colors
          duration-300
          hover:border-amber-400/60
          hover:bg-slate-950/35
        "
      >
        {/* ICON + TEXT LAYOUT */}
        <div
          style={{
            transitionDelay: revealDelay,
          }}
          className="
            relative z-10
            flex flex-col sm:flex-row
            opacity-0
            transition-opacity
            duration-1000
            ease-out
            group-data-[visible=true]:opacity-100
            motion-reduce:opacity-100
            motion-reduce:transition-none
          "
        >
          {/* ICON */}
          <div className="relative flex min-h-32 items-center justify-center sm:w-2/5">
            <Icon
              aria-hidden="true"
              className="size-14 text-amber-400/85"
              strokeWidth={1.3}
            />
          </div>

          {/* TEXT */}
          <div className="flex flex-1 flex-col p-5 md:p-6">
            {/* NUMBER - CYAN */}
            <span className="mb-2 text-sm font-bold text-cyan-400">
              {service.number}
            </span>

            {/* TITLE - WHITE */}
            <h3
              className="
                mb-4
                text-2xl
                font-extrabold
                leading-tight
                text-white
                scale-y-[1.1]
                origin-left
                drop-shadow-md
                md:text-[27px]
              "
            >
              {t(`cards.${service.translationKey}.title`)}
            </h3>

            {/* DESCRIPTION - AMBER */}
            <p className="mb-6 flex-1 text-sm leading-relaxed text-amber-400 font-bold drop-shadow-md">
              {t(`cards.${service.translationKey}.description`)}
            </p>

            {/* AMBER LINE */}
            <div className="mb-2 h-0.5 w-14 bg-amber-400" />

            {/* HIGHLIGHT - CYAN */}
            <p className="text-xs font-bold tracking-wide text-cyan-400">
              {t(`cards.${service.translationKey}.highlight`)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
