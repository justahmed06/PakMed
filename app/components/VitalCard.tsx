'use client';
import React, { useState } from 'react';

export default function VitalCard({ id, type, data, isFlipped, onFlip, onSave }) {
  const [val1, setVal1] = useState(type === 'bmi' ? data.h : type === 'bp' ? data.sys : data.hba1c || data.val);
  const [val2, setVal2] = useState(type === 'bmi' ? data.w : data.dia || 0);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: isFlipped ? 50 : 1 }}>
      <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`} style={{
        position: 'relative', width: '100%', height: '100%',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d'
      }}>
        {/* FRONT: Cinematic Display */}
        <div className="card-face card-front" onClick={onFlip}>
          <span className="label">{data.title}</span>
          <div className="value-container">
            <div className="main-value">
              {type === 'bp' ? `${data.sys}/${data.dia}` : data.val}
            </div>
          </div>
          <div className="status" style={{ color: data.color }}>● {data.status}</div>
        </div>

        {/* BACK: Sovereign Input Vault */}
        <div className="card-face card-back" onClick={(e) => e.stopPropagation()}>
          <h3 className="label" style={{ color: '#3D5AFE' }}>CLINICAL ENTRY</h3>
          
          <div className="input-grid">
            {type === 'bmi' && (
              <>
                <div className="mini-label">H: {val1}cm | W: {val2}kg</div>
                <input type="range" min="140" max="220" value={val1} onChange={e => setVal1(Number(e.target.value))} />
                <input type="range" min="40" max="150" value={val2} onChange={e => setVal2(Number(e.target.value))} />
              </>
            )}
            {type === 'bp' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" value={val1} onChange={e => setVal1(Number(e.target.value))} className="vault-input" placeholder="SYS" />
                <input type="number" value={val2} onChange={e => setVal2(Number(e.target.value))} className="vault-input" placeholder="DIA" />
              </div>
            )}
            {(type === 'sugar' || type === 'heart') && (
              <input type="number" value={val1} onChange={e => setVal1(Number(e.target.value))} className="vault-input" placeholder="Value" />
            )}
          </div>

          <div className="action-row">
            <button onClick={() => onSave(val1, val2)} className="save-btn">CONFIRM</button>
            <button onClick={onFlip} className="cancel-btn">BACK</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-face {
          position: absolute; inset: 0; backface-visibility: hidden;
          border-radius: 35px; padding: 35px; display: flex; flex-direction: column;
          background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(60px);
        }
        .card-front { cursor: pointer; transition: border 0.3s; }
        .card-front:hover { border-color: rgba(61, 90, 254, 0.3); }
        .card-back { transform: rotateY(180deg); background: rgba(8, 11, 22, 1); border: 1px solid #3D5AFE; }
        .is-flipped { transform: rotateY(180deg); }
        .label { font-size: 0.65rem; color: #94A3B8; letter-spacing: 3px; }
        .value-container { flex: 1; display: flex; align-items: center; justify-content: center; }
        .main-value { font-size: 5rem; font-weight: bold; letter-spacing: -2px; }
        .status { font-weight: bold; font-size: 0.8rem; }
        .vault-input { background: #000; border: 1px solid #333; color: #fff; padding: 15px; border-radius: 15px; width: 100%; font-family: inherit; font-size: 1.2rem; }
        .action-row { display: flex; gap: 12px; margin-top: auto; }
        .save-btn { flex: 2; background: #3D5AFE; border: none; color: #fff; border-radius: 15px; padding: 18px; font-weight: bold; cursor: pointer; }
        .cancel-btn { flex: 1; background: rgba(255,255,255,0.05); border: none; color: #fff; border-radius: 15px; padding: 18px; cursor: pointer; }
      `}</style>
    </div>
  );
}