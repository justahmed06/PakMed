'use client';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import BookingModal from './BookingModal';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🏥 SOVEREIGN ASSETS
const sovereignIcon = typeof window !== 'undefined'
  ? L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })
  : undefined;

const ANCHOR_BAHADURABAD: [number, number] = [24.8825, 67.0694];
const DEFAULT_MAP_CENTER: [number, number] = [24.9180, 67.1325];

const SECTORS = [
  { name: "Bahadurabad (Central)", coords: [24.8825, 67.0694] },
  { name: "Gulistan-e-Johar (Block 20)", coords: [24.9176, 67.1197] },
  { name: "DHA Phase 6", coords: [24.8080, 67.0480] },
  { name: "North Nazimabad", coords: [24.9372, 67.0422] },
];

/** Shape returned by the Overpass API for a single OSM element. */
interface OverpassElement {
  readonly lat?: number;
  readonly lon?: number;
  readonly center?: { readonly lat: number; readonly lon: number };
  readonly tags: {
    readonly name?: string;
    readonly amenity?: string;
  };
}

interface OverpassResponse {
  readonly elements: readonly OverpassElement[];
}

interface NearbyResult {
  readonly name: string;
  readonly coords: [number, number];
  readonly type: "Hospital" | "Clinic";
  readonly dist: number;
}

// 📡 THE LIVE SCANNER (Overpass API)
async function fetchNearbyHospitals(lat: number, lng: number): Promise<NearbyResult[]> {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${lat},${lng});
      node["amenity"="clinic"](around:5000,${lat},${lng});
    );
    out center;
  `;
  try {
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    const data: OverpassResponse = await response.json();
    return data.elements.map((el) => ({
      name: el.tags.name || "Medical Facility",
      coords: [(el.lat ?? el.center?.lat ?? 0), (el.lon ?? el.center?.lon ?? 0)] as [number, number],
      type: (el.tags.amenity === 'hospital' ? 'Hospital' : 'Clinic') as "Hospital" | "Clinic",
      dist: getDistance(lat, lng, el.lat ?? el.center?.lat ?? 0, el.lon ?? el.center?.lon ?? 0)
    })).sort((a, b) => a.dist - b.dist).slice(0, 8);
  } catch { return []; }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 🚁 ZOOM CONTROLLER (Listens for Sidebar Clicks)
interface MapEffectProps {
  targetCoords: [number, number] | null;
  userCoords: [number, number] | null;
  setNearby: React.Dispatch<React.SetStateAction<NearbyResult[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function MapEffect({ targetCoords, userCoords, setNearby, setLoading }: MapEffectProps) {
  const map = useMap();

  // Fly to specific hospital when clicked
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 16, { duration: 1.5 });
    }
  }, [targetCoords, map]);

  // Fly to User Location & Fetch Data
  useEffect(() => {
    if (userCoords) {
      map.flyTo(userCoords, 14, { duration: 2 });
      setLoading(true);
      fetchNearbyHospitals(userCoords[0], userCoords[1]).then(data => {
        setNearby(data);
        setLoading(false);
      });
    }
  }, [userCoords, map, setNearby, setLoading]);

  return null;
}

export default function Appointments() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [targetPos, setTargetPos] = useState<[number, number] | null>(null); // For sidebar clicks
  const [nearby, setNearby] = useState<NearbyResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingHospital, setBookingHospital] = useState<NearbyResult | null>(null);

  useEffect(() => { fetchNearbyHospitals(ANCHOR_BAHADURABAD[0], ANCHOR_BAHADURABAD[1]).then(setNearby); }, []);

  const handleLocate = () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => {
          if (typeof window !== 'undefined') {
            alert("Sensors blocked. Switching to Johar Simulation.");
          }
          setUserPos([24.9176, 67.1197]); // Johar Fallback
        }
      );
    }
  };

  return (
    <div className="glass-panel radar-layout flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-100px)] p-6" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'row', gap: '24px', width: '100%', padding: '24px', position: 'relative' }}>

      {/* 📋 SIDEBAR */}
      <div className="glass-panel radar-sidebar w-full lg:w-[400px] h-full overflow-y-auto pr-2 space-y-4 custom-scrollbar" style={{ width: '400px', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 'none' }}>
        <h2 className="text-cyan-400 font-semibold tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', marginBottom: '20px' }}>
          <span className="icon-badge" aria-hidden="true">⌖</span>
          {loading ? 'SCANNING SECTOR...' : 'LIVE RADAR RESULTS'}
        </h2>

        {/* Manual Sector Selector */}
        <select onChange={(e) => {
          const sec = SECTORS.find(s => s.name === e.target.value);
          if (sec) setUserPos(sec.coords as [number, number]);
        }} className="bg-slate-800/50 border border-white/10 rounded-xl text-slate-200" style={{ padding: '10px', marginBottom: '15px' }}>
          <option value="">Jump to Sector...</option>
          {SECTORS.map(s => <option key={s.name} value={s.name} style={{ color: 'black' }}>{s.name}</option>)}
        </select>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {nearby.map((h, i) => (
            <div key={i} className="hospital-item glass-card bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 rounded-2xl p-4 transition-all duration-200 shadow-md flex items-center justify-between"
              onClick={() => setTargetPos(h.coords)} // 👈 THIS MAKES IT ZOOM
              style={{ padding: '16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="icon-badge" aria-hidden="true">+</span>
                <div className="text-slate-100 font-semibold text-sm tracking-wide" style={{ fontSize: '0.9rem' }}>{h.name}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span className="text-emerald-400 text-xs font-mono" style={{ fontSize: '0.7rem' }}>{h.dist?.toFixed(1)} km</span>
                <button onClick={(e) => { e.stopPropagation(); setBookingHospital(h); }}
                  className="btn-gradient-pill"
                  style={{ color: '#67E8F9', padding: '8px 16px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 🗺️ MAP CANVAS */}
      <div className="glass-card radar-map-panel flex-1 h-full min-h-[500px] rounded-3xl overflow-hidden border border-cyan-400/40 shadow-[0_0_40px_rgba(56,189,248,0.25)] relative bg-slate-900/40 backdrop-blur-xl" style={{ flex: 1, width: 'auto', height: '100%', minHeight: '500px' }}>
        <MapContainer className="w-full h-full" center={DEFAULT_MAP_CENTER} zoom={15} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {nearby.map((h, i) => (
            <Marker key={i} position={h.coords as [number, number]} icon={sovereignIcon}>
              <Popup className="glass-popup">{h.name}</Popup>
            </Marker>
          ))}
          {userPos && (
            <>
              <Marker position={userPos} icon={sovereignIcon} />
              <Circle center={userPos} radius={4500} pathOptions={{ color: '#FF1744', fillColor: '#FF1744', fillOpacity: 0.15 }} />
            </>
          )}
          {/* THE LOGIC ENGINE */}
          <MapEffect targetCoords={targetPos} userCoords={userPos} setNearby={setNearby} setLoading={setLoading} />
        </MapContainer>
        <button
          onClick={handleLocate}
          className="absolute bottom-6 right-6 z-[1000] bg-slate-900/90 hover:bg-slate-800 backdrop-blur-xl border border-white/20 text-cyan-400 hover:text-cyan-300 font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-2xl shadow-xl shadow-cyan-950/50 flex items-center gap-2 transition-all radar-recalibrate"
        >
          <span>📍</span> RE-CALIBRATE GPS
        </button>
      </div>

      {/* 🗓️ BOOKING MODAL */}
      {bookingHospital && (
        <BookingModal hospital={bookingHospital} onClose={() => setBookingHospital(null)} />
      )}

      <style jsx global>{`
        .leaflet-container { background: #0A0E1A; font-family: var(--font-product-sans), sans-serif; }
        .radar-layout { box-sizing: border-box; }
        .radar-sidebar { box-sizing: border-box; }
        .radar-map-panel { box-sizing: border-box; min-height: 500px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(148, 163, 184, 0.45) transparent; }
        @media (max-width: 1023px) {
          .radar-layout { height: auto; flex-direction: column !important; overflow-y: auto; }
          .radar-sidebar { width: 100% !important; height: auto; max-height: 420px; }
          .radar-map-panel { width: 100%; min-height: 500px; height: 650px; flex: none; }
        }
        .radar-recalibrate { cursor: pointer; }
        .hospital-item:hover { background: rgba(61,90,254,0.1) !important; transform: translateX(5px); border-color: #3D5AFE !important; }
      `}</style>
    </div>
  );
}