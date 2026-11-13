"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useLocale, useTranslations } from "next-intl";

import { ArrowLeft, Keyboard, LocateFixed, MapPin, Search } from "lucide-react";

import {
  Map,
  Marker,
  GeolocateControl,
  AttributionControl,
  setWorkerUrl,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import { createVehiclePin } from "./createVehiclePin";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export default function ServiceMap() {
  const t = useTranslations("Map");
  const locale = useLocale();

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const geolocateRef = useRef<GeolocateControl | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);

  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  const [addressError, setAddressError] = useState("");
  const [gpsError, setGpsError] = useState(false);

  // Postavlja korisnikov cijan pin
  const placeUserMarker = useCallback((lng: number, lat: number) => {
    const map = mapRef.current;
    if (!map) return;

    // Uklanja prethodni korisnikov pin
    userMarkerRef.current?.remove();

    userMarkerRef.current = new Marker({
      color: "#06b6d4",
    })
      .setLngLat([lng, lat])
      .addTo(map);

    map.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true,
    });

    setGpsError(false);
    setAddressError("");
    setAddressOpen(false);
  }, []);

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

    map.addControl(new AttributionControl({ compact: true }), "top-left");

    // GPS lokacija korisnika
    const geolocate = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 15000,
      },
      trackUserLocation: false,
      showUserLocation: false,
      showAccuracyCircle: false,
    });

    map.addControl(geolocate, "top-right");
    geolocateRef.current = geolocate;

    geolocate.on("geolocate", (position) => {
      placeUserMarker(position.coords.longitude, position.coords.latitude);
    });

    geolocate.on("error", () => {
      setGpsError(true);
    });

    // Postojeći pin šlep-vozila
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
    // LONG PRESS — držanje karte 1 sekundu
    // ----------------------------------------

    const canvas = map.getCanvas();

    let holdTimer: ReturnType<typeof setTimeout> | null = null;
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
      // Drugi prst ili druga aktivna interakcija
      // otkazuju postavljanje pina.
      if (!event.isPrimary || activePointerId !== null) {
        cancelHold();
        return;
      }

      // Na računalu samo lijeva tipka miša
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      activePointerId = event.pointerId;

      startX = event.clientX;
      startY = event.clientY;

      // Pamtimo mjesto na kojem je držanje počelo
      const rect = canvas.getBoundingClientRect();

      const location = map.unproject([
        event.clientX - rect.left,
        event.clientY - rect.top,
      ]);

      holdTimer = setTimeout(() => {
        holdTimer = null;
        activePointerId = null;

        placeUserMarker(location.lng, location.lat);
      }, 1000);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerId !== activePointerId) {
        return;
      }

      const distance = Math.hypot(
        event.clientX - startX,
        event.clientY - startY,
      );

      // Ako korisnik pomiče kartu,
      // ne želimo slučajno postaviti pin.
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

    canvas.addEventListener("pointerdown", handlePointerDown);

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerEnd);

    window.addEventListener("pointercancel", handlePointerEnd);

    canvas.addEventListener("contextmenu", preventContextMenu);

    map.on("dragstart", cancelHold);
    map.on("zoomstart", cancelHold);

    // ----------------------------------------
    // CLEANUP
    // ----------------------------------------

    return () => {
      cancelHold();

      canvas.removeEventListener("pointerdown", handlePointerDown);

      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerEnd);

      window.removeEventListener("pointercancel", handlePointerEnd);

      canvas.removeEventListener("contextmenu", preventContextMenu);

      map.off("dragstart", cancelHold);
      map.off("zoomstart", cancelHold);

      userMarkerRef.current?.remove();
      vehicleMarker.remove();

      geolocateRef.current = null;
      mapRef.current = null;

      map.remove();
    };
  }, [placeUserMarker]);

  // GPS gumb
  function handleGps() {
    setGpsError(false);
    setAddressError("");

    geolocateRef.current?.trigger();
  }

  // Ručni unos adrese
  async function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = address.trim();
    if (!query) return;

    setIsSearchingAddress(true);
    setAddressError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=${locale}&q=${encodeURIComponent(query)}`,
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

      placeUserMarker(Number(result.lon), Number(result.lat));
    } catch {
      setAddressError(t("addressNotFound"));
    } finally {
      setIsSearchingAddress(false);
    }
  }

  return (
    <div className="relative h-full w-full min-w-0">
      <div ref={mapContainer} className="h-full w-full min-w-0" />

      {/* Kompaktna glass traka */}
      <div
        className="
          absolute inset-x-0 bottom-0 z-10
          border-y border-amber-400/50
          bg-slate-950/25 px-3 py-1.5
          text-white backdrop-blur-md
          shadow-[0_-6px_24px_rgba(0,0,0,0.25)]
        "
      >
        <div className="mx-auto w-full max-w-xl">
          {/* Naslov + uputa za pin */}
          <div
            dir="ltr"
            className="
    mb-1 flex flex-col gap-0.5
    min-[336px]:flex-row
    min-[336px]:items-start
    min-[336px]:justify-between
    min-[336px]:gap-2
  "
          >
            <p
              dir={locale === "ar" ? "rtl" : "ltr"}
              className={`
      shrink-0 whitespace-nowrap
      text-[10px] font-bold tracking-wide text-amber-400
      ${locale === "ar" ? "self-end min-[336px]:order-2" : "self-start"}
    `}
            >
              {t("title")}
            </p>

            <div
              dir="ltr"
              className={`
      flex min-w-0 max-w-full items-start gap-1
      text-[11px] font-semibold leading-snug text-slate-100
      ${
        locale === "ar"
          ? "self-end min-[336px]:order-1 min-[336px]:self-start"
          : "self-start"
      }
    `}
            >
              <MapPin size={11} className="shrink-0 text-amber-400" />

              <span
                dir={locale === "ar" ? "rtl" : "ltr"}
                className="min-w-0 whitespace-normal"
              >
                {t("pinHint")}
              </span>
            </div>
          </div>

          {addressOpen ? (
            <form
              onSubmit={handleAddressSubmit}
              className="flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => setAddressOpen(false)}
                aria-label={t("back")}
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-md border border-amber-500/30
                  bg-slate-950/25
                "
              >
                <ArrowLeft size={15} />
              </button>

              <input
                type="search"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder={t("addressPlaceholder")}
                aria-label={t("addressPlaceholder")}
                className="
                  h-8 min-w-0 flex-1
                  rounded-md border border-amber-500/30
                  bg-slate-950/25 px-2
                  text-base text-white
                  placeholder:text-slate-400
                  outline-none focus:border-amber-400
                  sm:text-sm
                "
              />

              <button
                type="submit"
                disabled={isSearchingAddress}
                aria-label={t("useAddress")}
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-md border border-amber-500/50
                  bg-amber-500/15 text-amber-400
                  disabled:opacity-50
                "
              >
                {isSearchingAddress ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Search size={16} />
                )}
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGps}
                className="
                  flex h-8 min-w-0
                  items-center justify-center gap-1.5
                  rounded-md border border-cyan-500/40
                  bg-slate-950/25 px-2
                  text-xs font-semibold
                  transition-colors hover:bg-cyan-500/15
                "
              >
                <LocateFixed size={14} className="shrink-0 text-cyan-400" />

                {t("gps")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAddressError("");
                  setAddressOpen(true);
                }}
                className="
                  flex h-8 min-w-0
                  items-center justify-center gap-1.5
                  rounded-md border border-amber-500/40
                  bg-slate-950/25 px-2
                  text-xs font-semibold
                  transition-colors hover:bg-amber-500/15
                "
              >
                <Keyboard size={14} className="shrink-0 text-amber-400" />

                {t("useAddress")}
              </button>
            </div>
          )}

          {gpsError && (
            <p className="mt-1 text-[10px] text-red-300">{t("gpsError")}</p>
          )}

          {addressError && (
            <p className="mt-1 text-[10px] text-red-300">{addressError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
