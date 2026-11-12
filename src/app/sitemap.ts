
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL?.replace(/\/+$/, "");

  // Još nemamo produkcijsku domenu.
  if (!siteUrl) {
    return [];
  }

  const languages = Object.fromEntries(
    routing.locales.map((locale) => {
      const pathname =
        locale === routing.defaultLocale ? "/" : `/${locale}`;

      return [locale, `${siteUrl}${pathname}`];
    })
  );

  return routing.locales.map((locale) => ({
    url: languages[locale],
    alternates: {
      languages,
    },
    changeFrequency: "monthly",
    priority: 1,
  }));
}
