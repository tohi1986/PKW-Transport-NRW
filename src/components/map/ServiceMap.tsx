"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useLocale, useTranslations } from "next-intl";

import { Map, Marker, setWorkerUrl } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { createVehiclePin } from "./createVehiclePin";
import { createUserPin } from "./createUserPin";
import { setupMapLongPress } from "./mapLongPress";
import { setupMapAttribution } from "./mapAttribution";
import LocationPanel from "./LocationPanel";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const MAP_STORAGE_KEY = "pkw-service-map-state";

type SavedMapState = {
  center: [number, number];
  zoom: number;
  userPin: [number, number] | null;
};

function readMapState(): SavedMapState | null {
  try {
    const stored = sessionStorage.getItem(MAP_STORAGE_KEY);

    if (!stored) return null;

    const state: SavedMapState = JSON.parse(stored);

    if (
      !Array.isArray(state.center) ||
      state.center.length !== 2 ||
      !state.center.every(Number.isFinite) ||
      !Number.isFinite(state.zoom) ||
      (state.userPin !== null &&
        (!Array.isArray(state.userPin) ||
          state.userPin.length !== 2 ||
          !state.userPin.every(Number.isFinite)))
    ) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

function saveMapState(map: Map, userMarker: Marker | null) {
  const center = map.getCenter();
  const pin = userMarker?.getLngLat();

  const state: SavedMapState = {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    userPin: pin ? [pin.lng, pin.lat] : null,
  };

  try {
    sessionStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ako browser blokira storage, karta i dalje radi.
  }
}

export default function ServiceMap() {
  const t = useTranslations("Map");
  const locale = useLocale();

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);

  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  const [addressError, setAddressError] = useState("");
  const [gpsError, setGpsError] = useState(false);

  // ----------------------------------------
  // KORISNIKOV PIN
  // ----------------------------------------

  const placeUserMarker = useCallback((lng: number, lat: number) => {
    const map = mapRef.current;

    if (!map) return;

    // Ukloni prethodni korisnikov pin
    userMarkerRef.current?.remove();

    // Postavi amber pin s cijan sredinom
    userMarkerRef.current = new Marker({
      element: createUserPin(),
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .addTo(map);
    // Zapamti korisnikov pin
    saveMapState(map, userMarkerRef.current);

    // Centriraj kartu na odabranu lokaciju
    map.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true,
    });

    setGpsError(false);
    setAddressError("");
    setAddressOpen(false);
  }, []);

  // ----------------------------------------
  // INICIJALIZACIJA KARTE
  // ----------------------------------------

  useEffect(() => {
    if (!mapContainer.current) return;

    const savedState = readMapState();

    const map = new Map({
      container: mapContainer.current,
      center: savedState?.center ?? [7.0116, 51.4556],
      zoom: savedState?.zoom ?? 13,
      minZoom: 8,
      maxZoom: 18,
      style: "/stamen.json",
      attributionControl: false,
    });

    mapRef.current = map;

    // Vrati korisnikov pin nakon promjene jezika
    if (savedState?.userPin) {
      userMarkerRef.current = new Marker({
        element: createUserPin(),
        anchor: "bottom",
      })
        .setLngLat(savedState.userPin)
        .addTo(map);
    }

    // Zapamti centar i zoom nakon pomicanja karte
    function handleMapMoveEnd() {
      saveMapState(map, userMarkerRef.current);
    }

    map.on("moveend", handleMapMoveEnd);

    // MapLibre atribucija ispod Navbara
    const cleanupAttribution = setupMapAttribution(map);

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

    // Long press od 1 sekunde
    const cleanupLongPress = setupMapLongPress(map, placeUserMarker);

    // ----------------------------------------
    // CLEANUP
    // ----------------------------------------

    return () => {
      saveMapState(map, userMarkerRef.current);

      map.off("moveend", handleMapMoveEnd);
      cleanupLongPress();
      cleanupAttribution();

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
        placeUserMarker(position.coords.longitude, position.coords.latitude);
      },

      () => {
        setGpsError(true);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  // ----------------------------------------
  // RUČNI UNOS ADRESE
  // ----------------------------------------

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

  // ----------------------------------------
  // MAPA + LOCATION PANEL
  // ----------------------------------------

  return (
    <div className="relative h-full w-full min-w-0">
      <div ref={mapContainer} className="h-full w-full min-w-0" />

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
