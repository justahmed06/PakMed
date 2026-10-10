'use client';
import React, { useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('Deep Space');
  const [history] = useState([
    { date: "Feb 12", event: "Diagnosis Triggered", status: "8A80 Migraine" },
    { date: "Feb 11", event: "Vitals Synchronized", status: "Optimal" }
  ]);

  return (
    <div className="vault-settings">
      <header className="v-header">CORE CONFIGURATION</header>

      <div className="v-section">
        <label>Active Theme</label>
        <button className="theme-toggle" onClick={() => setTheme(theme === 'Deep Space' ? 'Clinical Ice' : 'Deep Space')}>
          {theme}
        </button>
      </div>

      <div className="v-section">
        <label>Neural History Ledger</label>
        <div className="history-stack">
          {history.map((h, i) => (
            <div key={i} className="h-item">
              <span className="h-date">{h.date}</span>
              <span className="h-event">{h.event}</span>
              <span className="h-status">{h.status}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="system-purge" onClick={() => alert("VAULT PURGED.")}>SYSTEM PURGE</button>

      <style jsx>{`
        .vault-settings { flex: 1; maxWidth: 600px; margin: auto; display: flex; flex-direction: column; gap: 40px; padding: 20px; }
        .v-header { font-size: 0.8rem; letter-spacing: 6px; color: #2962FF; font-weight: 900; border-bottom: 1px solid rgba(41, 98, 255, 0.2); padding-bottom: 15px; }
        .v-section { display: flex; flex-direction: column; gap: 15px; }
        label { font-size: 0.6rem; letter-spacing: 3px; color: #94A3B8; font-weight: 800; text-transform: uppercase; }
        .theme-toggle { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 15px; border-radius: 12px; color: #00E5FF; font-weight: 900; cursor: pointer; }
        .history-stack { display: flex; flex-direction: column; gap: 10px; }
        .h-item { padding: 15px; background: rgba(255,255,255,0.02); border-radius: 10px; display: flex; justify-content: space-between; font-size: 0.8rem; }
        .h-date { color: #448AFF; font-weight: 900; }
        .system-purge { background: #FF1744; border: none; padding: 18px; border-radius: 14px; color: white; font-weight: 900; cursor: pointer; box-shadow: 0 0 20px rgba(255, 23, 68, 0.3); }
      `}</style>
    </div>
  );
}