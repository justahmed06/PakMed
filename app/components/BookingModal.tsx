'use client';
import React, { useState } from 'react';

export default function BookingModal({ hospital, onClose }) {
  const [step, setStep] = useState(1);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div className="glass-card" style={{ width: '400px', padding: '40px', border: '1px solid #3D5AFE', borderRadius: '30px', background: 'rgba(10, 14, 26, 0.95)' }}>
        
        {step === 1 ? (
          <>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{hospital.name}</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '30px' }}>Select an appointment slot</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
              {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(time => (
                <button key={time} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setStep(2)}>
                  {time}
                </button>
              ))}
            </div>
            
            <button onClick={onClose} style={{ width: '100%', padding: '15px', background: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer' }}>CANCEL</button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00E676' }}>CONFIRMED</h2>
            <p style={{ color: '#94A3B8', margin: '20px 0' }}>Your token #42 for <strong>{hospital.name}</strong> has been secured.</p>
            <button onClick={onClose} style={{ width: '100%', padding: '15px', background: '#3D5AFE', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>CLOSE VAULT</button>
          </div>
        )}

      </div>
    </div>
  );
}