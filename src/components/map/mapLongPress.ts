
import type { Map } from "maplibre-gl";

export function setupMapLongPress(
  map: Map,
  onSelectLocation: (lng: number, lat: number) => void
): () => void {
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

      onSelectLocation(location.lng, location.lat);
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

  // Cleanup: ukloni sve što smo registrirali
  return () => {
    cancelHold();

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
  };
}
