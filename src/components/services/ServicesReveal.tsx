
"use client";

import { useEffect } from "react";

export default function ServicesReveal() {
  useEffect(() => {
    const root = document.getElementById("services");
    if (!root) return;

    const elements =
      root.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;

            element.dataset.visible = "true";
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
