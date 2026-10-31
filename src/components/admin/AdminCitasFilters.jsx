/**
 * AdminCitasFilters.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Barra de filtrado, búsqueda y cambio de vista para la gestión de citas.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Search, X, Calendar, LayoutGrid, TableProperties } from 'lucide-react'
import { ESTADOS_CITA } from '@/data/mockData'

export default function AdminCitasFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  viewMode,
  onViewModeChange,
  totalResultados,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-soft p-4 sm:p-5 mb-6 shadow-sm space-y-4">

      {/* ── Fila superior: Búsqueda + Filtro de Fecha + Switch Vista ─────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">

        {/* Buscador */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-mid pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por cliente, bicicleta, servicio o teléfono..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-ultra border border-gray-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-dark placeholder:text-gray-mid"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-mid hover:text-dark rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filtro de Fecha */}
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid pointer-events-none"
            />
            <select
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="pl-8 pr-7 py-2.5 text-xs font-semibold bg-gray-ultra border border-gray-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all appearance-none cursor-pointer text-gray-dark"
            >
              <option value="todas">Todas las fechas</option>
              <option value="hoy">Citas de Hoy</option>
              <option value="proximos7">Próximos 7 días</option>
              <option value="mes">Este mes</option>
              <option value="pasadas">Citas pasadas</option>
            </select>
          </div>

          {/* Selector de modo de vista: Tabla / Tarjetas */}
          <div className="flex bg-gray-ultra p-1 rounded-xl border border-gray-soft shrink-0">
            <button
              onClick={() => onViewModeChange('cards')}
              title="Vista en Tarjetas"
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-dark shadow-xs'
                  : 'text-gray-mid hover:text-dark'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Vista en Tabla"
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-dark shadow-xs'
                  : 'text-gray-mid hover:text-dark'
              }`}
            >
              <TableProperties size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Fila inferior: Tabs de estados + contador ────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-soft/60">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => onStatusChange('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              !statusFilter
                ? 'bg-dark text-white'
                : 'bg-gray-ultra text-gray-dark hover:bg-gray-soft'
            }`}
          >
            Todas
          </button>
          {ESTADOS_CITA.map(({ value, label, badgeClass }) => {
            const isSelected = statusFilter === value
            return (
              <button
                key={value}
                onClick={() => onStatusChange(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? `${badgeClass} ring-1 ring-current shadow-xs`
                    : 'bg-gray-ultra text-gray-dark hover:bg-gray-soft'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <span className="text-xs font-medium text-gray-mid ml-auto">
          Mostrando <span className="font-bold text-gray-dark">{totalResultados}</span> citas
        </span>
      </div>
    </div>
  )
}
