/**
 * RutaCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Card individual para mostrar una ruta de salida del club.
 * Botón "Unirse" que guarda el userId en el array asistentes de Firestore.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { MapPin, TrendingUp, Users, CalendarDays, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth }      from '@/context/AuthContext'
import { useFirestore } from '@/hooks/useFirestore'
import { enviarConfirmacionRuta } from '@/services/apiRutas'
import { handleImageFallback } from '@/utils/imageUtils'
import { hasExpired } from '@/utils/rutasUtils'

// ── Badge de dificultad ───────────────────────────────────────────────────────
const DIFFICULTY_STYLES = {
  'Fácil':   'bg-green-100 text-green-700',
  'Media':   'bg-yellow-100 text-yellow-700',
  'Experto': 'bg-red-100 text-red-700',
}

export default function RutaCard({ ruta, onLoginRequired }) {
  const { currentUser }                      = useAuth()
  const { appendToArray, removeFromArray, loading: fbLoading } = useFirestore('rutas')

  const yaUnido = Boolean(currentUser && ruta.asistentes?.includes(currentUser.uid))
  const [joinedOverride, setJoinedOverride] = useState(null)
  const [emailMessage, setEmailMessage] = useState('')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const caducada = hasExpired(ruta.fechaRaw, ruta.fecha)
  const isJoined = joinedOverride ?? yaUnido

  const handleUnirse = async () => {
    if (caducada) return

    if (!currentUser) {
      onLoginRequired?.()
      return
    }
    if (isJoined) {
      setCancelError('')
      setCancelDialogOpen(true)
      return
    }

    try {
      await appendToArray(ruta.id, 'asistentes', currentUser.uid)
      setJoinedOverride(true)
    } catch (err) {
      console.error('Error al unirse a la ruta:', err)
      setEmailMessage('No se pudo completar la inscripción. Inténtalo de nuevo.')
      return
    }

    try {
      const resultado = await enviarConfirmacionRuta(ruta.id)
      setEmailMessage(resultado.simulado
        ? 'Te has unido a la ruta. El envío del correo está simulado en este entorno.'
        : 'Te has unido correctamente. Te enviamos un correo de confirmación.')
    } catch (err) {
      console.error('Te has unido a la ruta, pero no se pudo enviar el correo:', err)
      setEmailMessage(`Te has unido a la ruta, pero no se pudo enviar el correo: ${err.message}`)
    }
  }

  const handleCancelarInscripcion = async () => {
    if (!currentUser) return

    setCancelError('')
    try {
      await removeFromArray(ruta.id, 'asistentes', currentUser.uid)
      setJoinedOverride(false)
      setEmailMessage('')
      setCancelDialogOpen(false)
    } catch (err) {
      console.error('No se pudo cancelar la inscripción a la ruta:', err)
      setCancelError('No se pudo cancelar la inscripción. Inténtalo de nuevo.')
    }
  }

  const inscritos = ruta.asistentes?.length ?? 0
  const inscritosCount = inscritos + (isJoined && !yaUnido ? 1 : 0) - (!isJoined && yaUnido ? 1 : 0)

  return (
    <article className="group bg-white border border-gray-soft rounded-2xl overflow-hidden hover:border-dark/20 hover:shadow-lg transition-all duration-300">

      {/* ── Imagen ────────────────────────────────────────────────────────────── */}
      {ruta.imagen && (
        <div className="relative h-44 overflow-hidden bg-gray-ultra">
          <img
            src={ruta.imagen}
            alt={ruta.nombre}
            onError={handleImageFallback}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badge de dificultad sobre la imagen */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${
              DIFFICULTY_STYLES[ruta.dificultad] ?? 'bg-gray-100 text-gray-700'
            }`}
          >
            {ruta.dificultad}
          </span>
        </div>
      )}

      {/* ── Contenido ─────────────────────────────────────────────────────────── */}
      <div className="p-5">
        <h3 className="font-bold text-dark text-lg leading-tight mb-3 group-hover:text-accent transition-colors">
          {ruta.nombre}
        </h3>
        {caducada && (
          <p className="mb-3 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
            Ruta completada
          </p>
        )}
        {emailMessage && (
          <p role="status" className="mb-3 text-xs text-gray-mid">
            {emailMessage}
          </p>
        )}

        {/* ── Estadísticas ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Stat icon={MapPin} label="Distancia" value={`${ruta.distanciaKm} km`} />
          <Stat icon={TrendingUp} label="Desnivel" value={`+${ruta.desnivel} m`} />
          <Stat
            icon={Users}
            label="Inscritos"
            value={inscritosCount}
          />
        </div>

        {/* ── Fecha ─────────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 text-xs text-gray-mid mb-4">
          <CalendarDays size={13} />
          <span className="capitalize">{ruta.fecha}</span>
        </div>

        {/* ── Descripción ───────────────────────────────────────────────────────── */}
        {ruta.descripcion && (
          <p className="text-sm text-gray-mid leading-relaxed mb-5 line-clamp-2">
            {ruta.descripcion}
          </p>
        )}

        {/* ── Botón Unirse ──────────────────────────────────────────────────────── */}
        <button
          onClick={handleUnirse}
          disabled={caducada || fbLoading}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            caducada
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isJoined
              ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
              : 'bg-dark hover:bg-accent text-white'
          }`}
        >
          {fbLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : caducada ? (
            'Ruta completada'
          ) : isJoined ? (
            <>
              <CheckCircle2 size={15} />
              ¡Apuntado!
            </>
          ) : (
            'Unirse a la ruta'
          )}
        </button>
      </div>

      {cancelDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`cancel-route-title-${ruta.id}`}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id={`cancel-route-title-${ruta.id}`} className="text-lg font-bold text-dark">
              ¿Quieres cancelar tu inscripción a esta ruta?
            </h2>
            <p className="mt-2 text-sm text-gray-mid">{ruta.nombre}</p>
            {cancelError && (
              <p role="alert" className="mt-3 text-sm text-red-700">{cancelError}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelDialogOpen(false)}
                disabled={fbLoading}
                className="rounded-lg border border-gray-soft px-4 py-2 text-sm font-semibold text-gray-dark hover:bg-gray-ultra disabled:opacity-60"
              >
                No, mantener inscripción
              </button>
              <button
                type="button"
                onClick={handleCancelarInscripcion}
                disabled={fbLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {fbLoading && <Loader2 size={14} className="animate-spin" />}
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

// ── Subcomponente Stat ────────────────────────────────────────────────────────
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-ultra rounded-lg p-2.5 text-center">
      <Icon size={13} className="text-gray-mid mx-auto mb-1" />
      <p className="text-[11px] text-gray-mid">{label}</p>
      <p className="text-xs font-bold text-dark">{value}</p>
    </div>
  )
}
