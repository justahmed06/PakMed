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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative', overflowY: 'auto' }}>

      {/* 📋 SIDEBAR */}
      <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <h2 className="text-cyan-400 font-semibold tracking-wider" style={{ fontSize: '0.7rem', marginBottom: '20px' }}>
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
            <div key={i} className="hospital-item bg-slate-800/50 border border-white/10 rounded-xl"
              onClick={() => setTargetPos(h.coords)} // 👈 THIS MAKES IT ZOOM
              style={{ padding: '15px', cursor: 'pointer', transition: '0.2s' }}>

              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{h.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#00E676' }}>{h.dist?.toFixed(1)} km</span>
                <button onClick={(e) => { e.stopPropagation(); setBookingHospital(h); }}
                  className="bg-slate-800/50 border border-white/10 rounded-xl text-slate-200"
                  style={{ color: '#3D5AFE', padding: '5px 10px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 🗺️ MAP CANVAS */}
      <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 map-container w-full h-[600px] overflow-hidden relative" style={{ width: '100%', height: '600px', flex: 'none', padding: 0 }}>
        <MapContainer className="w-full h-full" center={ANCHOR_BAHADURABAD} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
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
          className="absolute bottom-6 right-6 z-10 bg-slate-900/80 backdrop-blur-md border border-white/10 text-cyan-400 radar-recalibrate"
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
        .map-container { width: 100%; height: 600px; }
        .radar-recalibrate {
          padding: 15px;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        }
        .hospital-item:hover { background: rgba(61,90,254,0.1) !important; transform: translateX(5px); border-color: #3D5AFE !important; }
      `}</style>
    </div>
  );
}