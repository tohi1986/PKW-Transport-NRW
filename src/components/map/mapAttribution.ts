
import {
  AttributionControl,
  type Map,
} from "maplibre-gl";

export function setupMapAttribution(
  map: Map
): () => void {
  map.addControl(
    new AttributionControl({ compact: true }),
    "top-left"
  );

  // Zatvori compact atribuciju pri učitavanju
  function closeAttribution() {
    const attribution = map
      .getContainer()
      .querySelector<HTMLElement>(
        ".maplibregl-ctrl-top-left .maplibregl-ctrl-attrib"
      );

    if (!attribution) return;

    attribution.classList.remove(
      "maplibregl-compact-show"
    );

    attribution.removeAttribute("open");
  }

  map.once("load", closeAttribution);

  // Pronađi naš header
  const header = document.getElementById("map-header");

  const infoCorner = map
    .getContainer()
    .querySelector<HTMLElement>(
      ".maplibregl-ctrl-top-left"
    );

  function positionMapInfo() {
    if (!header || !infoCorner) return;

    const headerBottom =
      header.getBoundingClientRect().bottom;

    const mapTop =
      map.getContainer().getBoundingClientRect().top;

    const offset = Math.max(
      8,
      headerBottom - mapTop + 8
    );

    infoCorner.style.setProperty(
      "top",
      `${offset}px`,
      "important"
    );
  }

  positionMapInfo();

  // Prati promjene visine Navbara
  const headerObserver = new ResizeObserver(
    positionMapInfo
  );

  if (header) {
    headerObserver.observe(header);
  }

  window.addEventListener(
    "resize",
    positionMapInfo
  );

  // Cleanup
  return () => {
    map.off("load", closeAttribution);

    headerObserver.disconnect();

    window.removeEventListener(
      "resize",
      positionMapInfo
    );
  };
}
