
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "mcdwg-95-168-120-197.run.pinggy-free.link",
    "mbrbs-95-168-120-197.free.pinggy.net",
    "*.free.pinggy.net",
    "*.run.pinggy-free.link",
  ],
};

export default withNextIntl(nextConfig);
