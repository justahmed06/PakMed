'use client';
import React, { useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('Deep Space');
  const [history] = useState([
    { date: "Feb 12", event: "Diagnosis Triggered", status: "8A80 Migraine" },
    { date: "Feb 11", event: "Vitals Synchronized", status: "Optimal" }
  ]);

  return (
    <div className="vault-settings glass-panel">
      <header className="v-header text-cyan-400 font-semibold tracking-wider">CORE CONFIGURATION</header>

      <div className="v-section glass-card">
        <label>Active Theme</label>
        <button className="theme-toggle btn-gradient-pill" onClick={() => setTheme(theme === 'Deep Space' ? 'Clinical Ice' : 'Deep Space')}>
          {theme}
        </button>
      </div>

      <div className="v-section glass-card">
        <label>Neural History Ledger</label>
        <div className="history-stack">
          {history.map((h, i) => (
            <div key={i} className="h-item glass-card">
              <span className="h-date">{h.date}</span>
              <span className="h-event">{h.event}</span>
              <span className="h-status">{h.status}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="system-purge" onClick={() => {
        if (typeof window !== 'undefined') {
          alert("VAULT PURGED.");
        }
      }}>SYSTEM PURGE</button>

      <style jsx>{`
        .vault-settings { flex: 1; max-width: 600px; margin: auto; display: flex; flex-direction: column; gap: 24px; padding: 24px; }
        .v-header { font-size: 0.8rem; letter-spacing: 4px; border-bottom: 1px solid rgba(34, 211, 238, 0.2); padding: 0 0 15px; }
        .v-section { display: flex; flex-direction: column; gap: 15px; padding: 20px; }
        label { font-size: 0.6rem; letter-spacing: 3px; color: #94A3B8; font-weight: 800; text-transform: uppercase; }
        .theme-toggle { justify-content: center; }
        .history-stack { display: flex; flex-direction: column; gap: 10px; }
        .h-item { padding: 15px; display: flex; justify-content: space-between; font-size: 0.8rem; }
        .h-date { color: #448AFF; font-weight: 900; }
        .system-purge { background: #FF1744; border: none; padding: 18px; border-radius: 14px; color: white; font-weight: 900; cursor: pointer; box-shadow: 0 0 20px rgba(255, 23, 68, 0.3); }
      `}</style>
    </div>
  );
}