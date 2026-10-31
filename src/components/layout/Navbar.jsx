/**
 * Navbar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Barra de navegación principal de MTB Tinanes.
 * - Logo + nombre del club
 * - Links de navegación
 * - Estado de sesión: avatar+nombre usuario | botón "Iniciar Sesión"
 * - Menú hamburguesa responsive
 * - Auto-abre LoginModal si ProtectedRoute redirige con openLogin:true
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/auth/LoginModal'

const BASE_NAV_LINKS = [
  { to: '/',        label: 'Inicio' },
  { to: '/rutas',   label: 'Rutas' },
  { to: '/taller',  label: 'Taller' },
  { to: '/galeria', label: 'Galería' },
]

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth()
  const location = useLocation()

  const [menuOpen,  setMenuOpen]  = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  // ── Auto-abrir modal si ProtectedRoute redirige con openLogin:true ──────────
  useEffect(() => {
    if (location.state?.openLogin) {
      setModalOpen(true)
    }
  }, [location.state])

  // ── Sombra sutil al hacer scroll ────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Cerrar menú mobile al navegar ───────────────────────────────────────────
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    try { await logout() } catch (e) { console.error(e) }
  }

  // ── Helper: iniciales del usuario ────────────────────────────────────────────
  const getInitials = (user) => {
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user.email[0].toUpperCase()
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-sm border-b border-gray-soft' : ''
        }`}
      >
        <nav className="max-w-8xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="MTB Los Titanes — Inicio"
          >
            <img
              src="/logo.jpg"
              alt="MTB Los Titanes Logo"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <span className="font-bold text-dark text-lg tracking-tight">
              MTB <span className="text-accent">Los Titanes</span>
            </span>
          </Link>

          {/* ── Links desktop ─────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {BASE_NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-accent bg-accent/5'
                      : 'text-gray-dark hover:text-dark hover:bg-gray-ultra'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ml-2 ${
                    isActive
                      ? 'bg-accent text-white shadow-xs'
                      : 'bg-accent/10 text-accent hover:bg-accent/20'
                  }`
                }
              >
                <Shield size={13} />
                Área de Administración
              </NavLink>
            )}
          </div>

          {/* ── Sesión ────────────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Avatar con iniciales */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(currentUser)}
                  </div>
                  {isAdmin && (
                    <span
                      title="Administrador"
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent text-white flex items-center justify-center text-[8px] font-black"
                    >
                      ★
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-dark max-w-[120px] truncate">
                  {currentUser.displayName ?? currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="p-2 text-gray-mid hover:text-dark hover:bg-gray-ultra rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-dark hover:bg-gray-dark text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <User size={15} />
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* ── Hamburguesa mobile ────────────────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-dark hover:text-dark rounded-lg hover:bg-gray-ultra transition-colors"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* ── Menú mobile desplegable ──────────────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-soft bg-white animate-slide-up">
            <div className="px-6 py-4 space-y-1">
              {BASE_NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-accent bg-accent/5'
                        : 'text-gray-dark hover:text-dark hover:bg-gray-ultra'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'bg-accent/10 text-accent'
                    }`
                  }
                >
                  <Shield size={16} />
                  Área de Administración
                </NavLink>
              )}

              <div className="pt-3 border-t border-gray-soft mt-3">
                {currentUser ? (
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-dark flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(currentUser)}
                      </div>
                      <span className="text-sm font-medium text-gray-dark truncate max-w-[160px]">
                        {currentUser.displayName ?? currentUser.email}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-sm text-gray-mid hover:text-dark transition-colors"
                    >
                      <LogOut size={14} />
                      Salir
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMenuOpen(false); setModalOpen(true) }}
                    className="w-full py-3 bg-dark text-white text-sm font-semibold rounded-lg hover:bg-gray-dark transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Modal de Login/Registro ──────────────────────────────────────────── */}
      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
