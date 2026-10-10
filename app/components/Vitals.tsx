'use client';
import React, { useState } from 'react';

function VitalCard({ label, val, status, color }: any) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.width / 2 - (e.clientX - rect.left)) / 15;
    const y = (rect.height / 2 - (e.clientY - rect.top)) / 15;
    setTilt({ x, y });
  };

  return (
    <div
      className={`card-container ${isFlipped ? 'is-flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)` }}
    >
      <div className="card-inner">
        <div className="card-front glass-fx">
          <span className="label">{label}</span>
          <div className="v-value">{val}</div>
          <div className="stat" style={{ color }}>● {status}</div>
        </div>
        <div className="card-back glass-fx">
          <span className="label">CLINICAL ENTRY: {label}</span>
          <div className="numpad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'C'].map(num => (
              <button key={num} className="n-btn" onClick={(e) => e.stopPropagation()}>{num}</button>
            ))}
          </div>
          <button className="confirm-btn">CONFIRM</button>
        </div>
      </div>
    </div>
  );
}

export default function Vitals() {
  return (
    <div className="vitals-matrix">
      <VitalCard label="BMI" val="22.9" status="NORMAL" color="#00E5FF" />
      <VitalCard label="BP" val="120/80" status="OPTIMAL" color="#00E5FF" />
      <VitalCard label="GLUCOSE" val="140" status="ELEVATED" color="#FFD600" />
      <VitalCard label="HR" val="72" status="RESTING" color="#FF1744" />
      <style jsx global>{`
        .vitals-matrix { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width: 100%; maxWidth: 880px; margin: auto; }
        .card-container { height: 260px; cursor: pointer; transform-style: preserve-3d; transition: transform 0.1s ease-out; }
        .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .is-flipped .card-inner { transform: rotateY(180deg); }
        .glass-fx { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 24px; padding: 25px; display: flex; flex-direction: column; background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(60px); border: 1px solid rgba(255,255,255,0.05); }
        .card-back { background: rgba(5, 8, 15, 0.98); transform: rotateY(180deg); padding: 15px; }
        .label { font-size: 0.55rem; letter-spacing: 4px; color: #94A3B8; font-weight: 700; margin-bottom: 5px; }
        .v-value { font-size: 3rem; font-weight: 900; color: white; margin-bottom: 10px; letter-spacing: -2px; text-align: center; }
        .numpad-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; flex: 1; }
        .n-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: white; border-radius: 8px; font-size: 0.8rem; cursor: pointer; }
        .confirm-btn { width: 100%; background: #2962FF; color: white; border: none; padding: 10px; border-radius: 12px; font-weight: 900; margin-top: 10px; cursor: pointer; }
      `}</style>
    </div>
  );
}