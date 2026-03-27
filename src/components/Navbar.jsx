import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = localStorage.getItem('sweetcrumbs_user') || 'Usuario'

  function handleLogout() {
    localStorage.removeItem('sweetcrumbs_user')
    navigate('/login')
  }

  const links = [
    { to: '/cupcakes', label: 'Cupcakes' },
    { to: '/pedidos', label: 'Pedidos' },
  ]

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #fecdd8',
      boxShadow: '0 2px 16px rgba(255,182,193,0.15)',
      position: 'sticky', top: 0, zIndex: 40,
      fontFamily: 'Lato, sans-serif',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        
        <Link to="/cupcakes" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #ffb3c6, #f43f70)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <rect x="18" y="36" width="28" height="16" rx="4" fill="white"/>
              <path d="M16 36 C16 24 48 24 48 36" fill="rgba(255,255,255,0.7)"/>
              <rect x="29" y="14" width="6" height="14" rx="3" fill="rgba(255,255,255,0.9)"/>
              <circle cx="32" cy="12" r="5" fill="white"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.2rem', fontWeight: '800',
            background: 'linear-gradient(135deg, #f43f70, #ffb3c6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Sweet Crumbs</span>
        </Link>

      
        <div style={{ display: 'flex', gap: '8px' }}>
          {links.map((link) => (
            <Link key={link.to} to={link.to} style={{
              textDecoration: 'none',
              padding: '8px 20px', borderRadius: '12px',
              fontWeight: '700', fontSize: '0.88rem',
              transition: 'all 0.2s ease',
              background: location.pathname === link.to
                ? 'linear-gradient(135deg, #ffb3c6, #f43f70)'
                : 'transparent',
              color: location.pathname === link.to ? 'white' : '#f43f70',
              boxShadow: location.pathname === link.to ? '0 4px 12px rgba(244,63,112,0.25)' : 'none',
              border: location.pathname === link.to ? 'none' : '1px solid #fecdd8',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: '#c4828f', fontWeight: '600' }}>
            Hola, <strong style={{ color: '#f43f70' }}>{user}</strong>
          </span>
          <button onClick={handleLogout} style={{
            padding: '8px 16px', borderRadius: '10px',
            border: '1.5px solid #fecdd8', background: 'white',
            color: '#f43f70', fontWeight: '700', fontSize: '0.82rem',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = '#fff1f5'}
            onMouseLeave={e => e.target.style.background = 'white'}
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}