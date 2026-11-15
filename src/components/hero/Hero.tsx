
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[40svh] min-h-[260px] w-full overflow-hidden md:h-[60svh]">
      <Image
        src="/images/hero.png"
        alt="Mokra cesta noću"
        fill
        sizes="100vw"
        className="object-cover object-bottom scale-[1.4] origin-bottom md:scale-100 md:object-center"
      />
    </section>
  );
}
