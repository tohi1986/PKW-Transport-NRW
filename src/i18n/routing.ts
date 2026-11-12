
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en", "tr", "pl", "ar"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  localeDetection: false,
});
