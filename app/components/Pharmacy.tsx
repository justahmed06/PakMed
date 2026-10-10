'use client';
import React, { useState } from 'react';

// 📞 SOVEREIGN VENDOR DIRECTORY
const VENDORS = [
  { name: "DVAGO", number: "9221111138246", color: "#EF5350" },
  { name: "Dawaai.pk", number: "923171719452", color: "#42A5F5" },
  { name: "MedsOne (Johar)", number: "923304900900", color: "#66BB6A" },
  { name: "MedsOne (Gulshan)", number: "923273594035", color: "#66BB6A" },
  { name: "Seven86 Medicos", number: "922134010647", color: "#AB47BC" },
  { name: "Time Medico (Stdm)", number: "923170584113", color: "#FFA726" },
  { name: "Time Medico (Clftn)", number: "923353935622", color: "#FFA726" }
];

export default function Pharmacy() {
  const [query, setQuery] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(VENDORS[0]);

  const handleDispatch = () => {
    if (!query) {
      alert("Please enter a medicine name.");
      return;
    }
    const message = `Inquiry:\n\n💊 Medicine: ${query}\n🔢 Quantity: ${qty}\n\n❓ Requesting Price & Availability.`;
    window.open(`https://wa.me/${selectedVendor.number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>

      {/* HEADER (Animated Gradient) */}
      <header className="glass-card" style={{ padding: '20px', textAlign: 'center', flexShrink: 0 }}>
        <h1 className="sovereign-text">PHARMACY DISPATCH</h1>
      </header>

      {/* ⌨️ INPUT CONSOLE */}
      <div className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0 }}>

        {/* Row 1: Medicine Input */}
        <div>
          <label style={{ display: 'block', color: '#3D5AFE', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '8px' }}>TARGET MEDICINE</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type prescription here..."
            style={{
              width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,90,254,0.3)',
              color: 'white', fontSize: '1.2rem', padding: '15px', borderRadius: '12px', outline: 'none',
              fontFamily: '"Product Sans", sans-serif'
            }}
          />
        </div>

        {/* Row 2: Controls */}
        <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>

          {/* Col A: Quantity (Slim) */}
          <div style={{ width: '120px' }}>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '8px' }}>QTY</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', height: 'calc(100% - 25px)' }}>
              <button onClick={() => setQty(qty + 1)} className="qty-btn" style={{ flex: 1 }}>+</button>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>{qty}</div>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn" style={{ flex: 1 }}>-</button>
            </div>
          </div>

          {/* Col B: Vendor Grid (Dense 3-Column) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '8px' }}>TARGET VENDOR</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', overflowY: 'auto', paddingRight: '5px' }}>
              {VENDORS.map((v) => (
                <button
                  key={v.name}
                  onClick={() => setSelectedVendor(v)}
                  style={{
                    padding: '10px 5px', borderRadius: '8px', border: selectedVendor.name === v.name ? `1px solid ${v.color}` : '1px solid rgba(255,255,255,0.05)',
                    background: selectedVendor.name === v.name ? `${v.color}20` : 'rgba(255,255,255,0.02)',
                    color: selectedVendor.name === v.name ? 'white' : '#64748B',
                    cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold', transition: '0.2s',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🚀 LAUNCH BUTTON (Compact) */}
        <button onClick={handleDispatch} className="dispatch-btn">
          <span>QUERY {selectedVendor.name} ➔</span>
        </button>

      </div>

      <style jsx>{`
        /* ✨ ANIMATED GRADIENT TEXT */
        .sovereign-text {
          font-size: 1.2rem;
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(to right, #3D5AFE, #00E676, #3D5AFE);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 3s linear infinite;
          margin: 0;
          text-transform: uppercase;
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        .qty-btn { background: rgba(255,255,255,0.05); border: none; color: white; border-radius: 8px; cursor: pointer; font-size: 1.2rem; transition: 0.2s; }
        .qty-btn:hover { background: rgba(255,255,255,0.15); }
        
        .dispatch-btn { 
          padding: 18px; background: #3D5AFE; color: white; border: none; 
          border-radius: 12px; fontWeight: bold; font-size: 0.9rem; letter-spacing: 2px; cursor: pointer; 
          transition: 0.3s; box-shadow: 0 0 20px rgba(61, 90, 254, 0.2); width: 100%;
        }
        .dispatch-btn:hover { background: #2945FF; transform: translateY(-2px); box-shadow: 0 0 35px rgba(61, 90, 254, 0.5); }
      `}</style>
    </div>
  );
}