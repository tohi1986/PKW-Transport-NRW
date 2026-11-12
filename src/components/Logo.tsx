import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="PKW Transport NRW Startseite"
      className="shrink-0"
    >
      <Image
        src="/images/Logo01.png"
        alt="PKW Transport NRW"
        width={2172}
        height={724}
        priority
        className="block h-auto w-28 min-[350px]:w-32 min-[390px]:w-36 sm:w-48 md:w-56 lg:w-56"
      />
    </Link>
  );
}
