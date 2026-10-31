/**
 * Home.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Landing page del club MTB Tinanes.
 * Secciones: Hero → Stats → Próximas Rutas → CTA Taller → Galería preview
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import RutasGrid from '@/components/rutas/RutasGrid'
import { handleImageFallback } from '@/utils/imageUtils'

export default function Home() {
  return (
    <div>
      {/* ────────────────────── HERO ────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center overflow-hidden bg-dark pt-16">
        {/* Fondo foto */}
        <img
          src="https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1400&q=80"
          alt=""
          aria-hidden="true"
          onError={handleImageFallback}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark" />

        <div className="relative z-10 my-auto text-center px-6 max-w-4xl mx-auto animate-slide-up">
          <p className="text-xs font-bold tracking-[0.4em] text-accent uppercase mb-6">
            ⬡ Club de Ciclismo de Montaña
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
            MTB<br />
            <span className="text-accent">Los Titanes</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed mb-10">
            Comunidad, técnica y pasión por el trail. Rutas épicas, taller experto y una familia que rueda junta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rutas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-accent/30 hover:shadow-xl"
            >
              Ver Próximas Rutas
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/taller"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              Reservar en Taller
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 mt-8 mb-8 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ─────────────────── PRÓXIMAS RUTAS ─────────────────── */}
      <section className="py-20 bg-gray-ultra">
        <div className="max-w-8xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-accent uppercase mb-2">
                Calendario
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark">
                Próximas Salidas
              </h2>
            </div>
            <Link
              to="/rutas"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-mid hover:text-dark transition-colors"
            >
              Ver todas
              <ArrowRight size={15} />
            </Link>
          </div>
          <RutasGrid />
        </div>
      </section>

      {/* ─────────────────── CTA TALLER ─────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6 md:px-8">
          <div className="rounded-3xl bg-dark p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-accent uppercase mb-3">
                Taller MTB
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Tu bici en manos expertas
              </h2>
              <p className="text-white/50 max-w-md leading-relaxed">
                Mecánicos especializados en mountain bike. Mantenimiento, reparación y puesta a punto. Sin esperas, con cita previa.
              </p>
            </div>
            <Link
              to="/taller"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              Pedir Cita
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
