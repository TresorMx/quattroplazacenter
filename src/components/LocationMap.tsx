'use client';

import { useEffect, useRef } from 'react';

/**
 * Google Maps con estilo blanco editorial y pin custom con el logo Quattro.
 * Carga la JS API on-demand (sin Next/Script para mantenerlo client-side).
 *
 * Requiere NEXT_PUBLIC_GMAPS_API_KEY en .env.local.
 */
export default function LocationMap({
  lat,
  lng,
  zoom = 16,
  address,
  pinSvgUrl = '/logos/mark.svg',
}: {
  lat: number;
  lng: number;
  zoom?: number;
  address?: string;
  pinSvgUrl?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const apiKey = process.env.NEXT_PUBLIC_GMAPS_API_KEY;
    if (!apiKey) {
      // Fallback: muestra un mapa estático bonito de OpenStreetMap si no hay key
      ref.current.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;background:#F6F4EF;color:#6B6863;font-size:13px;letter-spacing:0.18em;text-transform:uppercase">📍 ${address ?? `${lat}, ${lng}`}</div>`;
      return;
    }

    let cancelled = false;
    const loader = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=marker`;

    function init() {
      if (cancelled || !ref.current) return;
      const map = new (window as any).google.maps.Map(ref.current, {
        center: { lat, lng },
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: WHITE_EDITORIAL_STYLE,
      });
      // Pulso animado debajo del pin
      const pulseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
        <circle cx="40" cy="40" r="12" fill="#FFD057" opacity="0.5">
          <animate attributeName="r" values="12;36" dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0" dur="1.6s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="40" r="12" fill="#FFD057" opacity="0.3">
          <animate attributeName="r" values="12;24" dur="1.6s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0" dur="1.6s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
      </svg>`;
      const pulseUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pulseSvg);
      new (window as any).google.maps.Marker({
        position: { lat, lng },
        map,
        icon: { url: pulseUrl, scaledSize: new (window as any).google.maps.Size(80, 80), anchor: new (window as any).google.maps.Point(40, 40) },
        zIndex: 1,
      });

      // Pin encima
      const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="40" height="52">
        <path d="M20 0C9 0 0 9 0 20c0 14 20 32 20 32S40 34 40 20C40 9 31 0 20 0z" fill="#FFD057"/>
        <circle cx="20" cy="20" r="7" fill="#16151C"/>
      </svg>`;
      const pinUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSvg);
      new (window as any).google.maps.Marker({
        position: { lat, lng },
        map,
        icon: { url: pinUrl, scaledSize: new (window as any).google.maps.Size(40, 52), anchor: new (window as any).google.maps.Point(20, 52) },
        zIndex: 2,
      });
    }

    if ((window as any).google?.maps) {
      init();
    } else {
      const s = document.createElement('script');
      s.src = loader;
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    }

    return () => {
      cancelled = true;
    };
  }, [lat, lng, zoom, address, pinSvgUrl]);

  return <div ref={ref} className="h-[420px] w-full rounded-lg overflow-hidden border border-line bg-bg-soft" />;
}

/** Estilo Google Maps — gris minimalista, sin pines externos */
const WHITE_EDITORIAL_STYLE = [
  // Base gris
  { elementType: 'geometry',            stylers: [{ color: '#e8e8e8' }] },
  { elementType: 'labels.icon',         stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill',    stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke',  stylers: [{ color: '#e8e8e8' }] },
  // Sin puntos de interés ni íconos de negocios
  { featureType: 'poi',                 stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park',            stylers: [{ visibility: 'off' }] },
  // Sin transporte
  { featureType: 'transit',             stylers: [{ visibility: 'off' }] },
  // Carreteras
  { featureType: 'road',                elementType: 'geometry',        stylers: [{ color: '#ffffff' }] },
  { featureType: 'road',                elementType: 'geometry.stroke', stylers: [{ color: '#d0d0d0' }] },
  { featureType: 'road.highway',        elementType: 'geometry',        stylers: [{ color: '#dadada' }] },
  { featureType: 'road.highway',        elementType: 'geometry.stroke', stylers: [{ color: '#b8b8b8' }] },
  { featureType: 'road.highway',        elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  // Administrativo
  { featureType: 'administrative',      elementType: 'geometry',        stylers: [{ color: '#c8c8c8' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels',  stylers: [{ visibility: 'off' }] },
  // Agua
  { featureType: 'water',               elementType: 'geometry',        stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water',               elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
];
