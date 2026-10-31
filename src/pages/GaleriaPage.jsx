/**
 * GaleriaPage.jsx
 * Página pública de galería fotográfica.
 */

import GaleriaGrid from '@/components/galeria/GaleriaGrid'
import { Camera } from 'lucide-react'

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-8xl mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.25em] text-accent uppercase mb-3 flex items-center gap-2">
            <Camera size={13} />
            Momentos del club
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-dark mb-4">
            Galería
          </h1>
          <p className="text-gray-mid max-w-xl leading-relaxed">
            Instantes capturados en la montaña. La historia visual de MTB Los Titanes, carrera a carrera, ruta a ruta.
          </p>
        </div>

        <GaleriaGrid />
      </div>
    </main>
  )
}
