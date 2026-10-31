/**
 * Footer.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Pie de página minimalista con enlaces a redes sociales.
 * Iconos: SVG custom para Instagram y Strava, Lucide para Facebook.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react'
import { Facebook } from 'lucide-react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

// ── Iconos SVG custom ─────────────────────────────────────────────────────────
function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function StravaIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0 3 13.828h4.169"/>
    </svg>
  )
}

// ── Config redes sociales (cambia las URLs aquí) ──────────────────────────────
const SOCIAL_LINKS = [
  {
    label:   'Facebook',
    href:    'https://www.facebook.com/profile.php?id=100089376314263',
    Icon:    Facebook,
    hoverBg: 'hover:bg-blue-50 hover:text-blue-600',
  },
  {
    label:   'Instagram',
    href:    'https://instagram.com/mtbtinanes',
    Icon:    InstagramIcon,
    hoverBg: 'hover:bg-pink-50 hover:text-pink-600',
  },
  {
    label:   'Strava',
    href:    'https://strava.app.link/3sl8vs7NE7b',
    Icon:    StravaIcon,
    hoverBg: 'hover:bg-orange-50 hover:text-[#FC4C02]',
  },
]

const FOOTER_LINKS = [
  { to: '/',        label: 'Inicio' },
  { to: '/rutas',   label: 'Rutas' },
  { to: '/taller',  label: 'Taller' },
  { to: '/galeria', label: 'Galería' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [instagramModalOpen, setInstagramModalOpen] = useState(false)

  useEffect(() => {
    if (!instagramModalOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setInstagramModalOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [instagramModalOpen])

  return (
    <footer className="bg-dark text-white mt-24">
      <div className="max-w-8xl mx-auto px-6 md:px-8">

        {/* ── Sección principal ────────────────────────────────────────────────── */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10">

          {/* Branding */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.jpg" alt="MTB Los Titanes Logo" className="w-9 h-9 rounded-lg object-cover" />
              <span className="font-bold text-xl tracking-tight">MTB Los Titanes</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Club de ciclismo de montaña. Rutas, comunidad y pasión por el trail. Desde las montañas de Tinanes.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase mb-4">
              Síguenos
            </h3>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon, hoverBg }) => (
                label === 'Instagram' ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setInstagramModalOpen(true)}
                    aria-label={label}
                    title={label}
                    className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70 transition-all duration-200 ${hoverBg}`}
                  >
                    <Icon size={18} />
                  </button>
                ) : (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70 transition-all duration-200 ${hoverBg}`}
                  >
                    <Icon size={18} />
                  </a>
                )
              ))}
            </div>
            <p className="mt-4 text-xs text-white/30 leading-relaxed">
              Comparte tus rutas con<br />
              <span className="text-accent font-medium">#MTBTinanes</span>
            </p>
          </div>
        </div>

        {/* ── Copyright ────────────────────────────────────────────────────────── */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            © {year} MTB Los Titanes. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/20">
            Rueda duro, rueda seguro. 🚵
          </p>
        </div>
      </div>
      {instagramModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setInstagramModalOpen(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="instagram-modal-title"
            className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
          >
            <button
              type="button"
              onClick={() => setInstagramModalOpen(false)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 rounded-lg p-2 text-gray-mid transition-colors hover:bg-gray-ultra hover:text-dark"
            >
              <X size={18} />
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <InstagramIcon size={22} />
            </div>
            <h2 id="instagram-modal-title" className="text-xl font-bold text-dark">Próximamente</h2>
            <p className="mt-2 text-sm text-gray-mid">Muy pronto estaremos en Instagram.</p>
            <button
              type="button"
              onClick={() => setInstagramModalOpen(false)}
              className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Entendido
            </button>
          </section>
        </div>
      )}
    </footer>
  )
}
