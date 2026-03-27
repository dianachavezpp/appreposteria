import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CategoriasPage from './pages/CupcakesPage'
import RecetasPage from './pages/PedidosPage'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem('sweetcrumbs_user')
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff0f5', backgroundImage: 'radial-gradient(#fecdd8 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 60px' }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/categorias" element={
          <PrivateRoute>
            <Layout><CategoriasPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/recetas" element={
          <PrivateRoute>
            <Layout><RecetasPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/recetas" replace />} />
        <Route path="*" element={<Navigate to="/recetas" replace />} />
      </Routes>
    </BrowserRouter>
  )
}