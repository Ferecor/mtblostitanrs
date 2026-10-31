/**
 * AdminDeleteConfirmModal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal de confirmación para eliminar una cita.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function AdminDeleteConfirmModal({
  isOpen,
  onClose,
  cita,
  onConfirm,
}) {
  const [deleting, setDeleting] = useState(false)

  if (!isOpen || !cita) return null

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm(cita.id)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-soft p-6 text-center animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-mid hover:text-dark rounded-full hover:bg-gray-soft transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertTriangle size={28} />
        </div>

        <h3 className="text-lg font-bold text-dark mb-1">¿Eliminar cita de taller?</h3>
        <p className="text-xs text-gray-mid mb-4">
          Esta acción no se puede deshacer. Se eliminará el registro de la cita de:
        </p>

        <div className="bg-gray-ultra p-3 rounded-xl border border-gray-soft text-left text-xs space-y-1 mb-6">
          <p className="font-bold text-dark">{cita.nombre}</p>
          <p className="text-gray-mid">{cita.modeloBici || 'Bicicleta no especificada'}</p>
          <p className="font-mono text-gray-dark font-medium">
            {cita.fecha} a las {cita.hora}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 text-xs font-semibold text-gray-dark hover:bg-gray-ultra border border-gray-soft rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Sí, Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
