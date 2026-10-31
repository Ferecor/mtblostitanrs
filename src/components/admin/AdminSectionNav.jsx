import { NavLink } from 'react-router-dom'
import { CalendarDays, Image, Mountain } from 'lucide-react'

const sections = [
  { to: '/admin/citas', label: 'Gestión de citas', icon: CalendarDays },
  { to: '/admin/rutas', label: 'Gestión de rutas', icon: Mountain },
  { to: '/admin/galeria', label: 'Gestión de galería', icon: Image },
]

export default function AdminSectionNav() {
  return (
    <nav aria-label="Secciones de administración" className="mb-8 flex flex-wrap gap-2 print:hidden">
      {sections.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
              isActive
                ? 'bg-accent text-white'
                : 'border border-gray-soft bg-white text-gray-dark hover:border-accent/40 hover:text-accent'
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
