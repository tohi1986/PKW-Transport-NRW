export function createVehiclePin(isMobile: boolean): HTMLDivElement {
  const pinContainer = document.createElement("div");
  pinContainer.className = "relative flex flex-col items-center cursor-pointer";

  // Radarski echo val u cijan boji
  const radarWave = document.createElement("div");
  const headSizeNum = isMobile ? 36 : 44;
  radarWave.style.width = `${headSizeNum}px`;
  radarWave.style.height = `${headSizeNum}px`;
  radarWave.className = "absolute top-0 rounded-full border border-cyan-500 animate-radar-ping pointer-events-none";
  pinContainer.appendChild(radarWave);

  // Glavni statični pin (jantarni rub i strelica za vozilo)
  const pinHead = document.createElement("div");
  const headSize = `${headSizeNum}px`;
  pinHead.style.width = headSize;
  pinHead.style.height = headSize;
  pinHead.className = "relative z-10 flex items-center justify-center rounded-full bg-slate-950 border-[1.5px] border-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.4)]";

  const vehicleImage = document.createElement("img");
  vehicleImage.src = "/images/vehicle-marker.png";
  vehicleImage.alt = "PKW Transport NRW vozilo";
  vehicleImage.style.width = isMobile ? "22px" : "28px";
  vehicleImage.style.height = "auto";
  vehicleImage.style.objectFit = "contain";
  
  pinHead.appendChild(vehicleImage);
  pinContainer.appendChild(pinHead);

  const pinArrow = document.createElement("div");
  pinArrow.className = "relative z-10 w-0 h-0 border-x-[4px] border-x-transparent border-t-[7px] border-t-amber-500 -mt-[1px]";
  pinContainer.appendChild(pinArrow);

  return pinContainer;
}