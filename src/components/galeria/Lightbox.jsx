/**
 * Lightbox.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Visor de imagen ampliada a pantalla completa.
 * - Navegación prev/next
 * - Cierre con ESC, clic en fondo, o botón X
 * - Transición de opacidad suave
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { handleImageFallback } from '@/utils/imageUtils'

export default function Lightbox({ fotos, indice, onClose, onPrev, onNext }) {
  const foto = fotos[indice]

  // ── Teclado ─────────────────────────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')    onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!foto) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Botón cerrar ─────────────────────────────────────────────────────── */}
      <button
        onClick={onClose}
        aria-label="Cerrar visor"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* ── Contador ─────────────────────────────────────────────────────────── */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {indice + 1} / {fotos.length}
      </p>

      {/* ── Botón Prev ───────────────────────────────────────────────────────── */}
      <button
        onClick={onPrev}
        aria-label="Foto anterior"
        className="absolute left-3 md:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      {/* ── Imagen ───────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl max-h-[85vh] px-20 w-full flex items-center justify-center">
        <img
          key={foto.id}
          src={foto.url}
          alt={foto.alt}
          onError={handleImageFallback}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in"
        />
      </div>

      {/* ── Botón Next ───────────────────────────────────────────────────────── */}
      <button
        onClick={onNext}
        aria-label="Foto siguiente"
        className="absolute right-3 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* ── Alt text ─────────────────────────────────────────────────────────── */}
      {foto.alt && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm text-center px-4">
          {foto.alt}
        </p>
      )}
    </div>
  )
}
