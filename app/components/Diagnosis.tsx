'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function Diagnosis() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const letters = "PAKMED".split("");

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = (e: any) => {
        const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
        setQuery(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  return (
    <div className="diag-viewport">
      
      {/* 🔮 REFINED AMBIENT GRADIENT LOGO */}
      <div className="branding-deck">
        <h1 className="photon-logo">
          {letters.map((char, i) => (
            <span key={i} className="letter" style={{ animationDelay: `${i * 0.15}s` }}>{char}</span>
          ))}
        </h1>
        <p className="who-text">WORLD HEALTH ORGANIZATION ACCREDITED</p>
      </div>

      {/* 💬 PREMIUM GLASS PILL CONSOLE */}
      <div className={`glass-console ${isListening ? 'listening-active' : ''}`}>
        
        {/* ➕ THE PLUS ICON */}
        <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
        </button>

        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="How can PakMed help today?" 
          className="input-field" 
        />

        <div className="action-row">
          {/* 🌊 DYNAMIC VOICE FLOW ICON */}
          <button className={`tool-btn ${isListening ? 'active-wave' : ''}`} onClick={() => { isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start(); setIsListening(!isListening); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>
          
          <button className={`send-shuttle ${query ? 'ready' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"></path></svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .diag-viewport { display: flex; flex-direction: column; align-items: center; gap: 50px; }
        
        /* ❄️ SEQUENTIAL PHOTON PULSE */
        .photon-logo { display: flex; gap: 4px; justify-content: center; margin: 0; }
        .letter {
          font-size: 5.5rem; font-weight: 900; letter-spacing: 2px;
          color: #E0FFFF;
          text-shadow: 0 0 10px rgba(0, 229, 255, 0.1);
          animation: photon-flow 4s infinite ease-in-out;
          will-change: color, text-shadow; 
        }

        .who-text { color: #00E5FF; font-size: 0.65rem; font-weight: 800; letter-spacing: 8px; margin-top: 15px; opacity: 0.8; text-shadow: 0 0 15px rgba(0, 229, 255, 0.4); }

        /* 💬 HEAVY GLASSMORPHISM */
        .glass-console {
          width: 780px; padding: 16px 28px; display: flex; align-items: center; gap: 15px;
          background: rgba(15, 20, 35, 0.5); 
          backdrop-filter: blur(50px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12); 
          border-radius: 40px;
          transition: 0.4s cubic-bezier(0.2, 0, 0, 1);
          box-shadow: 0 15px 45px rgba(0,0,0,0.4);
        }
        .glass-console:focus-within { border-color: rgba(0, 229, 255, 0.5); box-shadow: 0 0 40px rgba(0, 229, 255, 0.2); }
        .listening-active { border-color: #00E5FF; animation: console-breathe 2s infinite ease-in-out; }

        .input-field { flex: 1; background: transparent; border: none; color: white; outline: none; font-size: 1.1rem; font-family: 'Product Sans', sans-serif; }
        .action-row { display: flex; align-items: center; gap: 12px; }
        .tool-btn { background: none; border: none; color: #94A3B8; cursor: pointer; padding: 6px; transition: 0.2s; }
        .tool-btn:hover { color: #00E5FF; }
        .active-wave { color: #00E5FF; filter: drop-shadow(0 0 8px #00E5FF); }
        
        .send-shuttle { width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.05); color: #fff; opacity: 0.3; border: none; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .send-shuttle.ready { opacity: 1; background: #2962FF; box-shadow: 0 0 25px rgba(41, 98, 255, 0.5); }

        @keyframes photon-flow { 
          0%, 100% { color: #E0FFFF; text-shadow: 0 0 10px rgba(0, 229, 255, 0.1); } 
          50% { color: #ffffff; text-shadow: 0 0 25px #00E5FF, 0 0 50px #2962FF; } 
        }
        @keyframes console-breathe { 0%, 100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.1); } 50% { box-shadow: 0 0 40px rgba(0, 229, 255, 0.3); } }
      `}</style>
    </div>
  );
}