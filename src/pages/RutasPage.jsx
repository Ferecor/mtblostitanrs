/**
 * RutasPage.jsx
 * Página pública de rutas de salida del club.
 */

import RutasGrid from '@/components/rutas/RutasGrid'
import { Mountain } from 'lucide-react'

export default function RutasPage() {
  return (
    <main className="min-h-screen bg-gray-ultra pt-24 pb-20">
      <div className="max-w-8xl mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.25em] text-accent uppercase mb-3 flex items-center gap-2">
            <Mountain size={13} />
            Calendario de salidas
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-dark mb-4">
            Rutas del Club
          </h1>
          <p className="text-gray-mid max-w-xl leading-relaxed">
            Todas las salidas organizadas por MTB Los Titanes. Únete, comparte kilómetros y vive la montaña con nosotros.
          </p>
        </div>

        <RutasGrid />
      </div>
    </main>
  )
}
