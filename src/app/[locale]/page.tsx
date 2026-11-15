
import ServiceMap from "@/components/map/ServiceMap";
import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <div className="h-full w-full">
      <section className="h-[60svh] w-full md:h-[55svh]">
        <ServiceMap />
      </section>

      <Hero />
    </div>
  );
}
