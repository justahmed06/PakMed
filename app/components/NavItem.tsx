export default function NavItem({ icon, label, expanded, active, onClick }) {
  return (
    <div onClick={onClick} style={{ 
      display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', borderRadius: '18px', cursor: 'pointer',
      background: active ? 'rgba(61, 90, 254, 0.15)' : 'transparent',
      color: active ? '#3D5AFE' : '#94A3B8',
      transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      {expanded && <span style={{ fontWeight: '600', fontSize: '1rem' }}>{label}</span>}
    </div>
  );
}