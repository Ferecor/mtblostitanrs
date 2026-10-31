/**
 * LoginModal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal minimalista de Login / Registro con Firebase Auth.
 * Tabs: "Iniciar Sesión" / "Crear Cuenta"
 * Manejo de errores en español.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

// ── Traducciones de errores Firebase ─────────────────────────────────────────
const FIREBASE_ERRORS = {
  'auth/email-already-in-use':    'Este correo ya está registrado.',
  'auth/invalid-email':           'El correo electrónico no es válido.',
  'auth/invalid-api-key':         'La configuración de Firebase no acepta esta clave de API. Revisa las variables VITE_FIREBASE_* y reinicia Vite.',
  'auth/api-key-not-valid':       'La clave de API de Firebase no es válida para este proyecto.',
  'auth/operation-not-allowed':   'El inicio de sesión con correo y contraseña no está habilitado en Firebase Authentication.',
  'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres.',
  'auth/user-not-found':          'No existe ninguna cuenta con ese correo.',
  'auth/user-disabled':           'Esta cuenta está deshabilitada en Firebase Authentication.',
  'auth/wrong-password':          'Contraseña incorrecta. Inténtalo de nuevo.',
  'auth/too-many-requests':       'Demasiados intentos. Espera unos minutos.',
  'auth/network-request-failed':  'Error de red. Comprueba tu conexión.',
  'auth/invalid-credential':      'Credenciales incorrectas. Revisa tu correo y contraseña.',
}

function getErrorMessage(error) {
  const message = FIREBASE_ERRORS[error?.code]
  if (message) return message

  const code = error?.code || 'sin código'
  return `No se pudo iniciar sesión. Código de error: ${code}.`
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function LoginModal({ isOpen, onClose }) {
  const [tab,     setTab]     = useState('login')   // 'login' | 'register'
  const [error,   setError]   = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { login, register } = useAuth()

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  if (!isOpen) return null

  // ── Cambiar de tab ──────────────────────────────────────────────────────────
  const switchTab = (newTab) => {
    setTab(newTab)
    setError(null)
    reset()
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setError(null)
    setSubmitting(true)
    try {
      if (tab === 'login') {
        await login(data.email, data.password)
      } else {
        await register(data.email, data.password, data.nombre)
      }
      onClose()
      reset()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl animate-slide-up overflow-hidden">

        {/* ── Botón cerrar ─────────────────────────────────────────────────── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-mid hover:text-dark transition-colors rounded-full hover:bg-gray-ultra"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        {/* ── Header con logo ──────────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-4 text-center border-b border-gray-soft">
          <img
            src="/logo.jpg"
            alt="MTB Los Titanes Logo"
            className="w-16 h-16 rounded-xl object-cover mx-auto mb-3"
          />
          <p className="text-xs font-semibold tracking-[0.25em] text-gray-mid uppercase mb-1">
            MTB Los Titanes
          </p>
          <h2 className="text-2xl font-bold text-dark">
            {tab === 'login' ? 'Bienvenido de nuevo' : 'Únete al club'}
          </h2>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="flex border-b border-gray-soft">
          {[
            { id: 'login',    label: 'Iniciar Sesión' },
            { id: 'register', label: 'Crear Cuenta' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === id
                  ? 'text-dark border-b-2 border-accent -mb-px'
                  : 'text-gray-mid hover:text-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Formulario ───────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-4">

          {/* Nombre (solo en registro) */}
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-dark uppercase tracking-wide mb-1.5">
                Nombre
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg bg-gray-ultra focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition ${
                    errors.nombre ? 'border-red-400' : 'border-gray-soft'
                  }`}
                  {...formRegister('nombre', {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                  })}
                />
              </div>
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-dark uppercase tracking-wide mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="email"
                placeholder="tu@correo.com"
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg bg-gray-ultra focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition ${
                  errors.email ? 'border-red-400' : 'border-gray-soft'
                }`}
                {...formRegister('email', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Introduce un correo válido',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-dark uppercase tracking-wide mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg bg-gray-ultra focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition ${
                  errors.password ? 'border-red-400' : 'border-gray-soft'
                }`}
                {...formRegister('password', {
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Error Firebase */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
