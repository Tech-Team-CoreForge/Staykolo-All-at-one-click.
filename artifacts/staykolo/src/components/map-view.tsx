import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';

type Pin = { id: string; name: string; lat: number; lng: number };

export function MapView({ pins, selectedId, onSelect, center, className = '' }: { pins: Pin[]; selectedId?: string; onSelect?: (id: string) => void; center?: [number, number]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const defaultCenter = center ?? [77.6389, 12.95];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const testCanvas = document.createElement('canvas');
    const hasWebGL2 = Boolean(testCanvas.getContext('webgl2'));
    if (!hasWebGL2) {
      setMapUnavailable(true);
      return undefined;
    }
    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        center: defaultCenter,
        zoom: center ? 14.2 : 10.8,
        style: {
          version: 8,
          sources: {
            osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      mapRef.current = map;
      return () => { map.remove(); mapRef.current = null; };
    } catch {
      setMapUnavailable(true);
      return undefined;
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
    pins.forEach((pin) => {
      const node = document.createElement('button');
      node.type = 'button';
      node.ariaLabel = `Select ${pin.name}`;
      node.className = `sk-map-pin ${pin.id === selectedId ? 'is-selected' : ''}`;
      node.innerHTML = '<span></span>';
      node.onclick = () => onSelect?.(pin.id);
      markersRef.current[pin.id] = new maplibregl.Marker({ element: node, anchor: 'bottom' }).setLngLat([pin.lng, pin.lat]).addTo(map);
    });
    if (center) map.easeTo({ center, duration: 0 });
  }, [pins, selectedId, onSelect, center]);

  if (mapUnavailable) {
    return <FallbackMap pins={pins} selectedId={selectedId} onSelect={onSelect} className={className} />;
  }

  return <div ref={containerRef} className={`relative min-h-[320px] overflow-hidden rounded-[14px] border border-[#cbdde3] bg-[#e6f0f1] ${className}`} aria-label="Map of Bengaluru properties" data-testid="map-properties">
    <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-md border border-[#d3e0e3] bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-[#58717c]"><MapPin size={12} className="text-[#0878b0]" /> Bengaluru area</div>
  </div>;
}

function FallbackMap({ pins, selectedId, onSelect, className }: { pins: Pin[]; selectedId?: string; onSelect?: (id: string) => void; className?: string }) {
  const left = 77.56;
  const right = 77.8;
  const top = 13.05;
  const bottom = 12.88;
  const xFor = (lng: number) => Math.min(92, Math.max(8, ((lng - left) / (right - left)) * 100));
  const yFor = (lat: number) => Math.min(88, Math.max(12, ((top - lat) / (top - bottom)) * 100));

  return <div className={`relative min-h-[320px] overflow-hidden rounded-[14px] border border-[#cbdde3] bg-[#e9f3f2] ${className}`} aria-label="Interactive map preview of Bengaluru properties" data-testid="map-properties">
    <div className="absolute inset-0 opacity-70" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(28deg, transparent 48%, rgba(112,163,164,.22) 49%, transparent 51%), linear-gradient(118deg, transparent 47%, rgba(112,163,164,.18) 48%, transparent 51%), linear-gradient(rgba(255,255,255,.62) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.62) 1px, transparent 1px)', backgroundSize: '100% 100%, 100% 100%, 46px 46px, 46px 46px' }} />
    <div className="absolute left-[18%] top-[19%] h-[52%] w-[52%] rotate-12 rounded-[48%] border border-[#a6d1cb] bg-[#d5ece5]/70" aria-hidden="true" />
    {pins.map((pin) => <button key={pin.id} type="button" aria-label={`Select ${pin.name}`} onClick={() => onSelect?.(pin.id)} className={`absolute z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 ${pin.id === selectedId ? 'scale-110' : ''}`} style={{ left: `${xFor(pin.lng)}%`, top: `${yFor(pin.lat)}%` }} data-testid={`fallback-map-pin-${pin.id}`}>
      <span className={`flex h-8 w-8 rotate-45 items-center justify-center rounded-full rounded-bl-none border-2 border-white shadow-[0_2px_7px_rgba(28,65,87,.24)] ${pin.id === selectedId ? 'bg-[#168a8d]' : 'bg-[#0878b0]'}`}><span className="h-2 w-2 -rotate-45 rounded-full bg-white" /></span>
    </button>)}
    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-md border border-[#d3e0e3] bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-[#58717c]"><MapPin size={12} className="text-[#0878b0]" /> Bengaluru area · map preview</div>
  </div>;
}