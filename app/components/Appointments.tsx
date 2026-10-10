'use client';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import BookingModal from './BookingModal';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🏥 SOVEREIGN ASSETS
const sovereignIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ANCHOR_BAHADURABAD: [number, number] = [24.8825, 67.0694];

const SECTORS = [
  { name: "Bahadurabad (Central)", coords: [24.8825, 67.0694] },
  { name: "Gulistan-e-Johar (Block 20)", coords: [24.9176, 67.1197] },
  { name: "DHA Phase 6", coords: [24.8080, 67.0480] },
  { name: "North Nazimabad", coords: [24.9372, 67.0422] },
];

// 📡 THE LIVE SCANNER (Overpass API)
async function fetchNearbyHospitals(lat: number, lng: number) {
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
    const data = await response.json();
    return data.elements.map((el: any) => ({
      name: el.tags.name || "Medical Facility",
      coords: [el.lat || el.center.lat, el.lon || el.center.lon],
      type: el.tags.amenity === 'hospital' ? 'Hospital' : 'Clinic',
      dist: getDistance(lat, lng, el.lat || el.center.lat, el.lon || el.center.lon)
    })).sort((a: any, b: any) => a.dist - b.dist).slice(0, 8);
  } catch (err) { return []; }
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 🚁 ZOOM CONTROLLER (Listens for Sidebar Clicks)
function MapEffect({ targetCoords, userCoords, setNearby, setLoading }) {
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
  const [nearby, setNearby] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingHospital, setBookingHospital] = useState<any>(null);

  useEffect(() => { fetchNearbyHospitals(ANCHOR_BAHADURABAD[0], ANCHOR_BAHADURABAD[1]).then(setNearby); }, []);

  const handleLocate = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => {
          alert("Sensors blocked. Switching to Johar Simulation.");
          setUserPos([24.9176, 67.1197]); // Johar Fallback
        }
      );
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', gap: '25px', position: 'relative' }}>

      {/* 📋 SIDEBAR */}
      <div className="glass-card" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '0.7rem', color: '#3D5AFE', letterSpacing: '4px', marginBottom: '20px' }}>
          {loading ? 'SCANNING SECTOR...' : 'LIVE RADAR RESULTS'}
        </h2>

        {/* Manual Sector Selector */}
        <select onChange={(e) => {
          const sec = SECTORS.find(s => s.name === e.target.value);
          if (sec) setUserPos(sec.coords as [number, number]);
        }} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid #333', borderRadius: '8px', marginBottom: '15px' }}>
          <option value="">Jump to Sector...</option>
          {SECTORS.map(s => <option key={s.name} value={s.name} style={{ color: 'black' }}>{s.name}</option>)}
        </select>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {nearby.map((h, i) => (
            <div key={i} className="hospital-item"
              onClick={() => setTargetPos(h.coords)} // 👈 THIS MAKES IT ZOOM
              style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: '0.2s' }}>

              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{h.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#00E676' }}>{h.dist?.toFixed(1)} km</span>
                <button onClick={(e) => { e.stopPropagation(); setBookingHospital(h); }}
                  style={{ background: 'rgba(61,90,254,0.2)', color: '#3D5AFE', border: '1px solid #3D5AFE', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleLocate} style={{ marginTop: 'auto', padding: '15px', background: '#3D5AFE', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          <span>📍</span> RE-CALIBRATE GPS
        </button>
      </div>

      {/* 🗺️ MAP CANVAS */}
      <div className="glass-card map-container" style={{ flex: 2, borderRadius: '40px', overflow: 'hidden', position: 'relative' }}>
        <MapContainer center={ANCHOR_BAHADURABAD} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
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
      </div>

      {/* 🗓️ BOOKING MODAL */}
      {bookingHospital && (
        <BookingModal hospital={bookingHospital} onClose={() => setBookingHospital(null)} />
      )}

      <style jsx global>{`
        .leaflet-container { background: #0A0E1A; font-family: 'Product Sans', sans-serif; }
        .hospital-item:hover { background: rgba(61,90,254,0.1) !important; transform: translateX(5px); border-color: #3D5AFE !important; }
      `}</style>
    </div>
  );
}