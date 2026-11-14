
"use client";

import { createUserPin } from "./createUserPin";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useLocale, useTranslations } from "next-intl";

import {
  Map,
  Marker,
  AttributionControl,
  setWorkerUrl,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { createVehiclePin } from "./createVehiclePin";
import LocationPanel from "./LocationPanel";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export default function ServiceMap() {
  const t = useTranslations("Map");
  const locale = useLocale();

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);

  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] =
    useState(false);

  const [addressError, setAddressError] = useState("");
  const [gpsError, setGpsError] = useState(false);

  // ----------------------------------------
 // KORISNIKOV PIN
// ----------------------------------------

const placeUserMarker = useCallback(
  (lng: number, lat: number) => {
    const map = mapRef.current;

    if (!map) return;

    // Ukloni prethodni korisnikov pin
    userMarkerRef.current?.remove();

    // Postavi novi amber pin s cijan sredinom
    userMarkerRef.current = new Marker({
      element: createUserPin(),
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .addTo(map);

      // Centriraj kartu na odabranu lokaciju
      map.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true,
      });

      setGpsError(false);
      setAddressError("");
      setAddressOpen(false);
    },
    []
  );

  // ----------------------------------------
  // INICIJALIZACIJA KARTE
  // ----------------------------------------

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
      container: mapContainer.current,
      center: [7.0116, 51.4556],
      zoom: 13,
      minZoom: 8,
      maxZoom: 18,
      style: "/stamen.json",
      attributionControl: false,
    });

    mapRef.current = map;

    // ----------------------------------------
    // MAPLIBRE ATRIBUCIJA
    // ----------------------------------------

    map.addControl(
      new AttributionControl({ compact: true }),
      "top-left"
    );

    // Zatvori compact atribuciju pri učitavanju
    map.once("load", () => {
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
    });

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

    // ----------------------------------------
    // POSTOJEĆI PIN ŠLEP-VOZILA
    // ----------------------------------------

    const isMobile = window.innerWidth < 640;
    const pinElement = createVehiclePin(isMobile);

    const vehicleMarker = new Marker({
      element: pinElement,
      anchor: "bottom",
      rotationAlignment: "map",
    })
      .setLngLat([7.0116, 51.4556])
      .addTo(map);

    // ----------------------------------------
    // LONG PRESS — 1 SEKUNDA
    // ----------------------------------------

    const canvas = map.getCanvas();

    let holdTimer: ReturnType<typeof setTimeout> | null =
      null;

    let activePointerId: number | null = null;

    let startX = 0;
    let startY = 0;

    function cancelHold() {
      if (holdTimer !== null) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }

      activePointerId = null;
    }

    function handlePointerDown(event: PointerEvent) {
      // Drugi prst otkazuje postavljanje pina
      if (!event.isPrimary || activePointerId !== null) {
        cancelHold();
        return;
      }

      // Na desktopu samo lijeva tipka miša
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      activePointerId = event.pointerId;

      startX = event.clientX;
      startY = event.clientY;

      // Mjesto na kojem je korisnik počeo držati
      const rect = canvas.getBoundingClientRect();

      const location = map.unproject([
        event.clientX - rect.left,
        event.clientY - rect.top,
      ]);

      holdTimer = setTimeout(() => {
        holdTimer = null;
        activePointerId = null;

        placeUserMarker(
          location.lng,
          location.lat
        );
      }, 1000);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerId !== activePointerId) {
        return;
      }

      const distance = Math.hypot(
        event.clientX - startX,
        event.clientY - startY
      );

      // Pomicanje karte otkazuje long press
      if (distance > 12) {
        cancelHold();
      }
    }

    function handlePointerEnd(event: PointerEvent) {
      if (event.pointerId === activePointerId) {
        cancelHold();
      }
    }

    function preventContextMenu(event: MouseEvent) {
      event.preventDefault();
    }

    canvas.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerEnd
    );

    window.addEventListener(
      "pointercancel",
      handlePointerEnd
    );

    canvas.addEventListener(
      "contextmenu",
      preventContextMenu
    );

    map.on("dragstart", cancelHold);
    map.on("zoomstart", cancelHold);

    // ----------------------------------------
    // CLEANUP
    // ----------------------------------------

    return () => {
      cancelHold();

      headerObserver.disconnect();

      window.removeEventListener(
        "resize",
        positionMapInfo
      );

      canvas.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerEnd
      );

      window.removeEventListener(
        "pointercancel",
        handlePointerEnd
      );

      canvas.removeEventListener(
        "contextmenu",
        preventContextMenu
      );

      map.off("dragstart", cancelHold);
      map.off("zoomstart", cancelHold);

      userMarkerRef.current?.remove();
      vehicleMarker.remove();

      mapRef.current = null;

      map.remove();
    };
  }, [placeUserMarker]);

  // ----------------------------------------
  // GPS — BROWSER API
  // ----------------------------------------

  function handleGps() {
    setGpsError(false);
    setAddressError("");

    if (!navigator.geolocation) {
      setGpsError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        placeUserMarker(
          position.coords.longitude,
          position.coords.latitude
        );
      },

      () => {
        setGpsError(true);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  // ----------------------------------------
  // RUČNI UNOS ADRESE
  // ----------------------------------------

  async function handleAddressSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = address.trim();

    if (!query) return;

    setIsSearchingAddress(true);
    setAddressError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=${locale}&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const results: Array<{
        lat: string;
        lon: string;
      }> = await response.json();

      if (!results.length) {
        setAddressError(t("addressNotFound"));
        return;
      }

      const result = results[0];

      placeUserMarker(
        Number(result.lon),
        Number(result.lat)
      );
    } catch {
      setAddressError(t("addressNotFound"));
    } finally {
      setIsSearchingAddress(false);
    }
  }

  // ----------------------------------------
  // MAPA + LOCATION PANEL
  // ----------------------------------------

  return (
    <div className="relative h-full w-full min-w-0">
      <div
        ref={mapContainer}
        className="h-full w-full min-w-0"
      />

      <LocationPanel
        addressOpen={addressOpen}
        address={address}
        isSearchingAddress={isSearchingAddress}
        addressError={addressError}
        gpsError={gpsError}
        onGpsClick={handleGps}
        onAddressOpen={() => {
          setAddressError("");
          setAddressOpen(true);
        }}
        onAddressClose={() => {
          setAddressOpen(false);
        }}
        onAddressChange={setAddress}
        onAddressSubmit={handleAddressSubmit}
      />
    </div>
  );
}
