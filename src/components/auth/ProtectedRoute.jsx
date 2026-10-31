/**
 * ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * HOC que protege rutas que requieren autenticación.
 * Si el usuario no está logueado, redirige a Home y abre el modal de login.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    // Guardamos la ruta destino en el state para redirigir tras login
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />
  }

  return children
}
