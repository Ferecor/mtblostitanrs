/**
 * TallerPage.jsx
 * Página protegida del taller (solo usuarios autenticados).
 * ProtectedRoute redirige a Home si no hay sesión.
 */

import { Link } from 'react-router-dom'
import { Wrench, Shield, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import TallerCitas from '@/components/taller/TallerCitas'

export default function TallerPage() {
  const { isAdmin } = useAuth()

  return (
    <main className="min-h-screen bg-gray-ultra pt-24 pb-20">
      <div className="max-w-8xl mx-auto px-6 md:px-8">

        {/* Acceso directo para Administradores */}
        {isAdmin && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-dark text-white rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs font-bold">Modo Administrador Activo</p>
                <p className="text-xs text-white/70">Gestiona, confirma y edita las citas de los clientes.</p>
              </div>
            </div>
            <Link
              to="/admin"
              className="px-3.5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              Área de Administración
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Header de sección */}
        <div className="mb-12 text-center max-w-xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] text-accent uppercase mb-3 flex items-center justify-center gap-2">
            <Wrench size={13} />
            Servicio técnico
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-dark mb-4">
            Taller MTB
          </h1>
          <p className="text-gray-mid leading-relaxed">
            Mecánicos especializados en mountain bike. Gestiona tu cita de forma rápida y sin complicaciones.
          </p>
        </div>

        {/* Formulario */}
        <TallerCitas />
      </div>
    </main>
  )
}
