"use client";

import { useEffect, useRef } from "react";
import { Map, Marker, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createVehiclePin } from "./createVehiclePin";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export default function ServiceMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
      container: mapContainer.current,
      center: [7.0116, 51.4556],
      zoom: 13,
      minZoom: 8,
      maxZoom: 18,
      style: "/stamen.json",
      attributionControl: { compact: true },
    });

    const isMobile = window.innerWidth < 640;
    const pinElement = createVehiclePin(isMobile);

    const vehicleMarker = new Marker({
      element: pinElement,
      anchor: "bottom",
      rotationAlignment: "map",
    })
      .setLngLat([7.0116, 51.4556])
      .addTo(map);

    return () => {
      vehicleMarker.remove();
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} className="h-full w-full min-w-0" />;
}