import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CupcakesPage from './pages/CupcakesPage'
import PedidosPage from './pages/PedidosPage'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem('sweetcrumbs_user')
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff0f5',
      backgroundImage: 'radial-gradient(#fecdd8 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}>
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
        <Route path="/cupcakes" element={
          <PrivateRoute>
            <Layout><CupcakesPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/pedidos" element={
          <PrivateRoute>
            <Layout><PedidosPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/cupcakes" replace />} />
        <Route path="*" element={<Navigate to="/cupcakes" replace />} />
      </Routes>
    </BrowserRouter>
  )
}