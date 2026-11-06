import Image from "next/image";
import Link from "next/link";

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
  width={2170}
  height={659}
  priority
  className="h-auto w-40 sm:w-48 md:w-56 lg:w-72"
/>

    </Link>
  );
}