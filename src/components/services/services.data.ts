
import {
  MapPinned,
  Wrench,
  CarFront,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceItem = {
  number: string;
  title: string;
  description: string;
  highlight: string;
  icon: LucideIcon;
};

export const services: ServiceItem[] = [
  {
    number: "01",
    title: "Germany & EU Transport",
    description:
      "Based in Essen, we provide vehicle transport locally, throughout Germany and across the EU.",
    highlight: "FROM ESSEN TO EUROPE",
    icon: MapPinned,
  },
  {
    number: "02",
    title: "On-Call Mechanic",
    description:
      "Technical assistance when you need help with your vehicle on the road.",
    highlight: "HELP WHEN YOU NEED IT",
    icon: Wrench,
  },
  {
    number: "03",
    title: "Vehicle Transport",
    description:
      "Reliable transportation of vehicles up to 3.5 tonnes using a dedicated trailer.",
    highlight: "UP TO 3.5 TONNES",
    icon: CarFront,
  },
  {
    number: "04",
    title: "Experience & Versatility",
    description:
      "Years of experience transporting different types of vehicles with care and attention.",
    highlight: "EXPERIENCE YOU CAN TRUST",
    icon: ShieldCheck,
  },
];
