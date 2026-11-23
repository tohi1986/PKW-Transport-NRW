
import {
  MapPinned,
  Wrench,
  CarFront,
  ShieldCheck,
} from "lucide-react";

export const services = [
  {
    number: "01",
    translationKey: "germanyEu",
    icon: MapPinned,
  },
  {
    number: "02",
    translationKey: "mechanic",
    icon: Wrench,
  },
  {
    number: "03",
    translationKey: "transport",
    icon: CarFront,
  },
  {
    number: "04",
    translationKey: "experience",
    icon: ShieldCheck,
  },
] as const;

export type ServiceItem = (typeof services)[number];
