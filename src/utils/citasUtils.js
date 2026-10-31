/**
 * citasUtils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Utilidades para formateo de datos, etiquetas y estados de citas.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { TIPOS_SERVICIO, ESTADOS_CITA } from '@/data/mockData'

export function getServicioLabel(tipo) {
  const item = TIPOS_SERVICIO.find((s) => s.value === tipo)
  return item ? item.label : (tipo || 'Servicio General')
}

export function getEstadoConfig(estado) {
  const item = ESTADOS_CITA.find((e) => e.value === estado)
  if (item) return item

  return {
    value: estado,
    label: estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Desconocido',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
    dotClass: 'bg-gray-400',
  }
}

export function formatearFecha(fechaStr) {
  if (!fechaStr) return '—'
  try {
    const [year, month, day] = fechaStr.split('-')
    if (!day) return fechaStr

    const meses = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ]
    const mesNombre = meses[parseInt(month, 10) - 1] || month
    return `${parseInt(day, 10)} ${mesNombre} ${year}`
  } catch {
    return fechaStr
  }
}
