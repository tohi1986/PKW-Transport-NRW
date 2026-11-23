
import ServiceMap from "@/components/map/ServiceMap";
import Hero from "@/components/hero/Hero";
import Services from "@/components/services/Services";

export default function Home() {
  return (
    <div className="h-full w-full">
      <section className="h-[60svh] w-full md:h-[55svh]">
        <ServiceMap />
      </section>

      <Hero />

      <Services />
    </div>
  );
}
