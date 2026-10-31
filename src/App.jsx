/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Componente raíz. Define el Router, el AuthProvider y las rutas de la app.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from '@/context/AuthContext'
import Navbar            from '@/components/layout/Navbar'
import Footer            from '@/components/layout/Footer'
import ProtectedRoute    from '@/components/auth/ProtectedRoute'
import AdminRoute        from '@/components/auth/AdminRoute'

import Home           from '@/pages/Home'
import RutasPage      from '@/pages/RutasPage'
import TallerPage     from '@/pages/TallerPage'
import GaleriaPage    from '@/pages/GaleriaPage'
const AdminCitasPage = lazy(() => import('@/pages/AdminCitasPage'))
const AdminRutasPage = lazy(() => import('@/pages/AdminRutasPage'))
const AdminGaleriaPage = lazy(() => import('@/pages/AdminGaleriaPage'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Layout principal */}
        <div className="flex flex-col min-h-screen bg-white font-sans antialiased">

          {/* Barra de navegación fija */}
          <Navbar />

          {/* Contenido principal — padding-top compensa la navbar fija (64px) */}
          <main className="flex-1">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/"        element={<Home />}        />
              <Route path="/rutas"   element={<RutasPage />}   />
              <Route path="/galeria" element={<GaleriaPage />} />

              {/* Ruta protegida — usuario autenticado */}
              <Route
                path="/taller"
                element={
                  <ProtectedRoute>
                    <TallerPage />
                  </ProtectedRoute>
                }
              />

              {/* Rutas de Administración de Citas */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Suspense fallback={null}>
                      <AdminCitasPage />
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/citas"
                element={
                  <AdminRoute>
                    <Suspense fallback={null}>
                      <AdminCitasPage />
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/rutas"
                element={
                  <AdminRoute>
                    <Suspense fallback={null}>
                      <AdminRutasPage />
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/galeria"
                element={
                  <AdminRoute>
                    <Suspense fallback={null}>
                      <AdminGaleriaPage />
                    </Suspense>
                  </AdminRoute>
                }
              />

              {/* Catch-all → redirect a Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Pie de página */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
