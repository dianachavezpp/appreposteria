import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const USUARIOS = [
  { usuario: 'admin', password: 'admin123' },
  { usuario: 'pastelera', password: '1234' },
]

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function handleLogin(e) {
    e.preventDefault()
    if (!form.usuario || !form.password) {
      setError('Por favor completa todos los campos.')
      return
    }
    const found = USUARIOS.find(
      (u) => u.usuario === form.usuario && u.password === form.password
    )
    if (!found) {
      setError('Usuario o contraseña incorrectos.')
      return
    }
    setLoading(true)
    setProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setProgress(100)
        setSuccess(true)
        localStorage.setItem('sweetcrumbs_user', form.usuario)
        setTimeout(() => navigate('/cupcakes'), 900)
      }
      setProgress(Math.min(p, 100))
    }, 120)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #ffe4ed 0%, #ffd6e7 40%, #ffccd8 70%, #ffc2d4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'Lato, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Círculos decorativos de fondo */}
      <div style={{ position: 'fixed', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,182,193,0.25)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,182,193,0.2)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,182,193,0.15)', pointerEvents: 'none' }} />

      {/* Tarjeta principal */}
      <div style={{
        background: 'white',
        borderRadius: '32px',
        padding: '48px 44px 40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 30px 80px rgba(255, 105, 135, 0.22), 0 8px 24px rgba(255,182,193,0.3)',
        position: 'relative', zIndex: 10,
        border: '1px solid rgba(255,192,203,0.3)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffe4ed, #ffb3c6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 28px rgba(255,105,135,0.3)',
            animation: 'floatUp 3s ease-in-out infinite',
            border: '3px solid rgba(255,182,193,0.5)',
          }}>
            {/* Cupcake SVG sin emojis */}
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
              <ellipse cx="32" cy="44" rx="18" ry="10" fill="#f43f70"/>
              <rect x="18" y="36" width="28" height="16" rx="4" fill="#f43f70"/>
              <path d="M16 36 C16 24 48 24 48 36" fill="#ffb3c6"/>
              <path d="M20 36 C20 28 44 28 44 36" fill="#ff85a1"/>
              <rect x="29" y="14" width="6" height="14" rx="3" fill="#ffb3c6"/>
              <circle cx="32" cy="12" r="6" fill="#f43f70"/>
              <circle cx="32" cy="12" r="3" fill="#ff85a1"/>
            </svg>
          </div>

          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.1rem', fontWeight: '800',
            background: 'linear-gradient(135deg, #f43f70, #ffb3c6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 6px',
          }}>Sweet Crumbs</h1>
          <p style={{ color: '#ffb3c6', fontSize: '0.85rem', margin: 0, letterSpacing: '0.5px' }}>
            Repostería artesanal con amor
          </p>

          {/* Separador */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px auto 0', justifyContent: 'center' }}>
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, #fecdd8)' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffb3c6' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f43f70' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffb3c6' }} />
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, #fecdd8)' }} />
          </div>
        </div>

        {/* Titulo */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: '700', color: '#3d1a24', margin: '0 0 4px' }}>
            Bienvenida de vuelta
          </h2>
          <p style={{ color: '#c4828f', fontSize: '0.83rem', margin: 0 }}>
            Ingresa tus datos para continuar
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff1f5', border: '1px solid #fecdd8',
            borderRadius: '14px', padding: '10px 14px',
            color: '#f43f70', fontSize: '0.82rem', marginBottom: '16px',
            animation: 'shake 0.4s ease',
          }}>
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Usuario */}
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.8rem', marginBottom: '7px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Usuario
            </label>
            <input
              type="text" name="usuario"
              value={form.usuario} onChange={handleChange}
              onFocus={() => setFocusedField('usuario')}
              onBlur={() => setFocusedField(null)}
              placeholder="Escribe tu usuario"
              disabled={loading}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '13px 16px',
                borderRadius: '16px',
                border: `2px solid ${focusedField === 'usuario' ? '#ffb3c6' : '#ffe4ed'}`,
                background: focusedField === 'usuario' ? '#fff9fb' : '#fffafc',
                fontSize: '0.92rem', color: '#3d1a24', outline: 'none',
                transition: 'all 0.25s ease',
                boxShadow: focusedField === 'usuario' ? '0 0 0 4px rgba(255,179,198,0.2)' : 'none',
              }}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.8rem', marginBottom: '7px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Contrasena
            </label>
            <input
              type="password" name="password"
              value={form.password} onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              disabled={loading}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '13px 16px',
                borderRadius: '16px',
                border: `2px solid ${focusedField === 'password' ? '#ffb3c6' : '#ffe4ed'}`,
                background: focusedField === 'password' ? '#fff9fb' : '#fffafc',
                fontSize: '0.92rem', color: '#3d1a24', outline: 'none',
                transition: 'all 0.25s ease',
                boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(255,179,198,0.2)' : 'none',
              }}
            />
          </div>

          {/* Barra de progreso */}
          {loading && (
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#f43f70', fontWeight: '600' }}>
                  {success ? 'Entrando...' : 'Verificando...'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#ffb3c6', fontWeight: '700' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ background: '#ffe4ed', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '999px',
                  background: 'linear-gradient(90deg, #ffb3c6, #f43f70, #ffb3c6)',
                  backgroundSize: '200% 100%',
                  width: `${progress}%`,
                  transition: 'width 0.12s ease',
                  animation: 'shimmer 1.5s linear infinite',
                }} />
              </div>
            </div>
          )}

          {/* Boton */}
          <button type="submit" disabled={loading} style={{
            padding: '15px',
            borderRadius: '16px', border: 'none',
            background: loading
              ? 'linear-gradient(135deg, #fecdd8, #ffb3c6)'
              : 'linear-gradient(135deg, #ffb3c6 0%, #f43f70 100%)',
            color: 'white', fontWeight: '800', fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(244,63,112,0.35)',
            transition: 'all 0.25s ease', marginTop: '6px',
            letterSpacing: '0.3px',
          }}>
            {loading ? (success ? 'Bienvenida!' : 'Cargando...') : 'Iniciar Sesion'}
          </button>
        </form>

        {/* Hint */}
        <div style={{
          marginTop: '22px', padding: '12px 16px',
          background: 'linear-gradient(135deg, #fff9fb, #ffe4ed)',
          borderRadius: '14px', textAlign: 'center',
          border: '1px solid #fecdd8',
        }}>
          <p style={{ color: '#c4828f', fontSize: '0.75rem', margin: 0 }}>
            Usuario: <strong style={{ color: '#f43f70' }}>admin</strong> &nbsp;|&nbsp; Contrasena: <strong style={{ color: '#f43f70' }}>admin123</strong>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#ffccd8', fontSize: '0.72rem', marginTop: '16px', marginBottom: 0 }}>
          Sweet Crumbs 2025 — Hecho con amor
        </p>
      </div>

      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
