
import Image from "next/image";
import ServiceCard from "./ServiceCard";
import ServicesReveal from "./ServicesReveal";
import { services } from "./services.data";

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate bg-[#020714] text-white"
    >
      {/* CLIENT: SCROLL REVEAL OBSERVER */}
      <ServicesReveal />

      {/* BLACK INTRO + ANIMATED TITLE */}
      <div className="relative z-10 flex min-h-[35svh] flex-col items-center justify-center px-5 pb-12 pt-20 text-center md:min-h-[45svh]">
        <div
          data-reveal
          data-visible="false"
          className="translate-y-10 opacity-0 blur-sm transition-all duration-1000 delay-100 ease-out data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 data-[visible=true]:blur-none motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-none"
        >
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-amber-400 md:text-sm">
            WHAT WE OFFER
          </p>

          <h2
            id="services-heading"
            className="text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl"
          >
            Our Services
          </h2>

          <div className="mx-auto mt-6 h-0.5 w-24 rounded-full bg-amber-400 shadow-[0_0_18px_#f59e0b]" />
        </div>
      </div>

      {/* IMAGE SECTION */}
      <div className="relative">
        {/* STICKY BACKGROUND */}
        <div className="sticky top-0 h-svh overflow-hidden bg-[#020714]">
          <div className="relative h-full w-full">
            <Image
              src="/images/section.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center lg:object-[center_25%]"
            />

            {/* TOP BLACK FADE */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[35svh] bg-linear-to-b from-[#020714] via-[#020714]/65 to-transparent" />

            {/* VERY LIGHT OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-black/10" />

            {/* BOTTOM FADE */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#020714]/65 to-transparent" />
          </div>
        </div>

        {/* CONTENT OVER BACKGROUND */}
        <div className="relative z-10 mt-[-100svh]">
          {/* SPACE TO ENJOY IMAGE */}
          <div
            aria-hidden="true"
            className="min-h-[65svh] md:min-h-[85svh]"
          />

          {/* SERVICES CARDS */}
          <div className="mx-auto max-w-7xl px-5 pb-28 md:px-12 md:pb-36">
            <div className="grid gap-5 lg:flex lg:flex-col lg:gap-10">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.number}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
