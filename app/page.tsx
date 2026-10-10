'use client';
import React, { useState } from 'react';
import NavItem from './components/NavItem';
import Diagnosis from './components/Diagnosis';
import Vitals from './components/Vitals';
import Pharmacy from './components/Pharmacy';
import Appointments from './components/Appointments';
import Settings from './components/Settings';

const Icons = {
  Brain: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>,
  Pulse: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>,
  Pill: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="6"></rect><path d="M12 6v12"></path></svg>,
  MapPin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Gear: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
};

export default function PakMedOS() {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="os-frame">
      
      {/* 🌌 CENTRAL LIGHT ENGINE (The glowing core behind the glass) */}
      <div className="light-engine">
        <div className="core-orb"></div>
      </div>

      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="sidebar-glass"
        style={{ width: isExpanded ? '260px' : '80px' }}
      >
        <div className="sidebar-brand">
          <div className="brand-orb">P</div>
          {isExpanded && <span className="brand-text">PAKMED</span>}
        </div>
        
        <nav className="nav-stack">
          <NavItem icon={Icons.Brain} label="Diagnosis" expanded={isExpanded} active={activeTab === 'diagnosis'} onClick={() => setActiveTab('diagnosis')} />
          <NavItem icon={Icons.Pulse} label="Vitals" expanded={isExpanded} active={activeTab === 'vitals'} onClick={() => setActiveTab('vitals')} />
          <NavItem icon={Icons.Pill} label="Pharmacy" expanded={isExpanded} active={activeTab === 'pharmacy'} onClick={() => setActiveTab('pharmacy')} />
          <NavItem icon={Icons.MapPin} label="Appointments" expanded={isExpanded} active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
        </nav>
        
        <div className="sidebar-footer">
           <NavItem icon={Icons.Gear} label="Settings" expanded={isExpanded} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      <main className="viewport">
        {activeTab === 'diagnosis' && <Diagnosis />}
        {activeTab === 'vitals' && <Vitals />}
        {activeTab === 'pharmacy' && <Pharmacy />}
        {activeTab === 'appointments' && <Appointments />}
        {activeTab === 'settings' && <Settings />}
      </main>

      <style jsx global>{`
        @font-face {
          font-family: 'Product Sans';
          src: local('Product Sans'), local('Google Sans');
        }

        .os-frame { display: flex; height: 100vh; background: #010204; color: white; position: relative; overflow: hidden; font-family: 'Product Sans', sans-serif; }
        
        /* 🌌 CENTRAL LIGHT ENGINE */
        .light-engine { position: absolute; inset: 0; z-index: 0; pointer-events: none; display: flex; align-items: center; justify-content: center; }
        .core-orb {
          width: 120vw;
          height: 120vw;
          background: radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, rgba(41, 98, 255, 0.15) 40%, transparent 70%);
          filter: blur(180px); /* Massive blur for soft bokeh */
          opacity: 0.6;
          animation: core-pulse 10s ease-in-out infinite alternate;
        }
        @keyframes core-pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.1); opacity: 0.8; } }

        .sidebar-glass { background: rgba(10, 15, 30, 0.6); backdrop-filter: blur(60px); border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; padding: 40px 12px; z-index: 100; transition: width 0.4s cubic-bezier(0.1, 0, 0, 1); }
        .sidebar-brand { display: flex; align-items: center; gap: 15px; margin-bottom: 50px; padding-left: 5px; }
        .brand-orb { width: 36px; height: 36px; background: linear-gradient(135deg, #2962FF, #00E5FF); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: black; box-shadow: 0 0 25px rgba(0, 229, 255, 0.3); }
        .brand-text { font-weight: 900; letter-spacing: 2px; color: #00E5FF; font-size: 1rem; }
        .nav-stack { flex: 1; }
        .sidebar-footer { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
        .viewport { flex: 1; padding: 40px; position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
}