import { parse, parseISO, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

export function getRouteDate(fechaRaw, fecha) {
  if (fechaRaw) {
    const routeDate = typeof fechaRaw?.toDate === 'function'
      ? fechaRaw.toDate()
      : typeof fechaRaw === 'string'
        ? parseISO(fechaRaw)
        : new Date(fechaRaw)

    if (!Number.isNaN(routeDate.getTime())) return routeDate
  }

  if (!fecha) return null

  const parsedDate = parse(fecha, "d 'de' MMMM", new Date(), { locale: es })
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

export function hasExpired(fechaRaw, fecha) {
  const routeDate = getRouteDate(fechaRaw, fecha)
  return Boolean(routeDate && routeDate < startOfDay(new Date()))
}
