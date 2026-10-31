import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AdminRoute({ children }) {
  const {
    currentUser,
    emailVerified,
    isAdminEmail,
    isAdmin,
    refreshCurrentUser,
    sendVerificationEmail,
  } = useAuth()
  const location = useLocation()
  const [sending, setSending] = useState(false)
  const [checking, setChecking] = useState(false)
  const [notice, setNotice] = useState(null)
  const [error, setError] = useState(null)

  if (!currentUser) {
    return <Navigate to="/" state={{ openLogin: true, from: location }} replace />
  }

  if (isAdmin) return children

  const handleSendVerification = async () => {
    setSending(true)
    setNotice(null)
    setError(null)
    try {
      await sendVerificationEmail()
      setNotice(`Hemos enviado un enlace de verificación a ${currentUser.email}. Revisa también la carpeta de spam.`)
    } catch (sendError) {
      const messages = {
        'auth/too-many-requests': 'Se han solicitado demasiados correos. Espera un momento antes de volver a intentarlo.',
        'auth/network-request-failed': 'No se pudo conectar con Firebase. Comprueba tu conexión e inténtalo de nuevo.',
        'auth/unauthorized-continue-uri': 'Firebase no permite esta dirección de retorno. Revisa los dominios autorizados en Authentication.',
      }
      setError(messages[sendError.code] || `No se pudo enviar el correo de verificación (${sendError.code || 'error desconocido'}).`)
    } finally {
      setSending(false)
    }
  }

  const handleCheckVerification = async () => {
    setChecking(true)
    setNotice(null)
    setError(null)
    const verified = await refreshCurrentUser()
    if (verified) {
      setNotice('Correo verificado. Cargando el panel de administración…')
    } else {
      setError('Firebase todavía no confirma la verificación. Abre el enlace del correo y vuelve a comprobarlo.')
    }
    setChecking(false)
  }

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-dark">
          {isAdminEmail ? 'Verifica tu correo para acceder' : 'No se puede acceder al Área de Administración'}
        </h1>
        <p className="mt-4 text-sm text-gray-dark">
          Sesión iniciada como <strong>{currentUser.email}</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-dark">
          {!isAdminEmail
            ? 'Esta cuenta no está autorizada como administradora.'
            : emailVerified
            ? 'Firebase confirma el correo, pero esta cuenta no está autorizada como administradora en esta versión de la web.'
            : 'La cuenta está autorizada para administrar citas, pero Firebase todavía no confirma la verificación del correo.'}
        </p>
        {isAdminEmail && !emailVerified && (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleSendVerification}
              disabled={sending}
              className="w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? 'Enviando…' : 'Enviar correo de verificación'}
            </button>
            <button
              type="button"
              onClick={handleCheckVerification}
              disabled={checking}
              className="w-full rounded-lg border border-gray-soft px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-ultra disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checking ? 'Comprobando…' : 'Ya verifiqué mi correo'}
            </button>
          </div>
        )}
        {notice && <p role="status" className="mt-4 text-sm text-emerald-700">{notice}</p>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-dark"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}
