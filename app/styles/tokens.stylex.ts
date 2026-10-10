import * as stylex from '@stylexjs/stylex';

// THE PAKMED "VELION" MASTERPIECE TOKENS
export const colors = stylex.defineVars({
  background: '#03050C',        // Deep Space Indigo
  surface: 'rgba(15, 23, 42, 0.6)', // 3D Glass Surface
  border: 'rgba(255, 255, 255, 0.1)',
  primaryIndigo: '#3D5AFE',     // Neon Indigo Glow
  textMain: '#F8FAFC',          // Crisp White
  textDim: '#94A3B8',           // Muted Slate
  emergency: '#FF1744',        // Pulsing Red
});

export const spacing = stylex.defineVars({
  cardRadius: '24px',
  gutter: '16px',
});

export const animations = stylex.defineVars({
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
});