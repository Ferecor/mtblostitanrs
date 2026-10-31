/**
 * mockData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Datos de ejemplo para desarrollo local.
 * En producción, estos datos vienen de Firestore.
 *
 * Para poblar Firestore con estos datos puedes usar la Firebase Console
 * o un script de seed (ver README).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'

const hoy = new Date()

// ── Rutas de Salida ───────────────────────────────────────────────────────────
export const RUTAS_MOCK = [
  {
    id: 'ruta-001',
    nombre: 'Circular Tinanes Alto',
    distanciaKm: 28,
    desnivel: 820,
    dificultad: 'Media',
    fecha: format(addDays(hoy, -3), "d 'de' MMMM", { locale: es }),
    fechaRaw: addDays(hoy, -3).toISOString(),
    descripcion: 'Ruta clásica del club por los senderos altos de Tinanes con vistas panorámicas.',
    asistentes: [],
    imagen: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=640&q=80',
  },
  {
    id: 'ruta-002',
    nombre: 'Bajada Técnica La Cantera',
    distanciaKm: 14,
    desnivel: 1240,
    dificultad: 'Experto',
    fecha: format(addDays(hoy, -7), "d 'de' MMMM", { locale: es }),
    fechaRaw: addDays(hoy, -7).toISOString(),
    descripcion: 'Descenso técnico con roca suelta y drops naturales. Solo ciclistas experimentados.',
    asistentes: [],
    imagen: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=640&q=80',
  },
  {
    id: 'ruta-003',
    nombre: 'Ruta Verde del Río',
    distanciaKm: 22,
    desnivel: 380,
    dificultad: 'Fácil',
    fecha: format(addDays(hoy, -10), "d 'de' MMMM", { locale: es }),
    fechaRaw: addDays(hoy, -10).toISOString(),
    descripcion: 'Perfecta para iniciarse. Caminos verdes sin grandes dificultades técnicas.',
    asistentes: [],
    imagen: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=640&q=80',
  },
  {
    id: 'ruta-004',
    nombre: 'Cresta del Viento',
    distanciaKm: 35,
    desnivel: 1100,
    dificultad: 'Media',
    fecha: format(addDays(hoy, -14), "d 'de' MMMM", { locale: es }),
    fechaRaw: addDays(hoy, -14).toISOString(),
    descripcion: 'Travesía por la cresta con viento constante y vistas de 360°.',
    asistentes: [],
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&q=80',
  },
]

// ── Galería de Fotos ──────────────────────────────────────────────────────────
export const GALERIA_MOCK = [
  {
    id: 'foto-001',
    url: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400&q=75',
    alt: 'Bicicleta preparada para una ruta de montaña al atardecer',
    fecha: '2024-09-14',
  },
  {
    id: 'foto-002',
    url: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&q=75',
    alt: 'Ciclista avanzando por una carretera rodeada de bosque',
    fecha: '2024-09-07',
  },
  {
    id: 'foto-003',
    url: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=400&q=75',
    alt: 'Salida grupal MTB al amanecer',
    fecha: '2024-08-31',
  },
  {
    id: 'foto-004',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75',
    alt: 'Paisaje de montaña al amanecer',
    fecha: '2024-08-18',
  },
  {
    id: 'foto-005',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75',
    alt: 'Taller de reparación de bicicletas',
    fecha: '2024-08-05',
  },
  {
    id: 'foto-006',
    url: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=400&q=75',
    alt: 'Ciclista por una carretera de montaña al atardecer',
    fecha: '2024-07-21',
  },
  {
    id: 'foto-007',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=75',
    alt: 'Bicicleta aparcada junto a una pared urbana',
    fecha: '2024-07-07',
  },
  {
    id: 'foto-008',
    url: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400&q=75',
    alt: 'Bicicleta de viaje preparada para recorrer la montaña',
    fecha: '2024-06-29',
  },
  {
    id: 'foto-009',
    url: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&q=75',
    alt: 'Ciclista avanzando por una carretera rodeada de bosque',
    fecha: '2024-06-15',
  },
]

// ── Tipos de Servicio del Taller ──────────────────────────────────────────────
export const TIPOS_SERVICIO = [
  { value: 'mantenimiento', label: 'Mantenimiento General' },
  { value: 'averia',        label: 'Reparación de Avería' },
  { value: 'ajustes',       label: 'Ajustes y Puesta a Punto' },
  { value: 'suspension',    label: 'Revisión de Suspensión' },
  { value: 'frenos',        label: 'Revisión de Frenos' },
  { value: 'transmision',   label: 'Limpieza y Transmisión' },
]

// ── Estados de Cita ───────────────────────────────────────────────────────────
export const ESTADOS_CITA = [
  {
    value: 'pendiente',
    label: 'Pendiente',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  {
    value: 'confirmada',
    label: 'Confirmada',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  {
    value: 'en_proceso',
    label: 'En Taller',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    dotClass: 'bg-purple-500',
  },
  {
    value: 'completada',
    label: 'Completada',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  {
    value: 'cancelada',
    label: 'Cancelada',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
  },
]

// ── Citas de Taller Mock ──────────────────────────────────────────────────────
const formatearFechaRelativa = (diasOffset) => {
  const f = addDays(hoy, diasOffset)
  return format(f, 'yyyy-MM-dd')
}

export const CITAS_MOCK = [
  {
    id: 'cita-001',
    nombre: 'Carlos Ruiz Gómez',
    userEmail: 'carlos.ruiz@gmail.com',
    telefono: '612 345 678',
    userId: 'user-mock-1',
    modeloBici: 'Orbea Oiz M-Team 2024',
    tipoServicio: 'suspension',
    fecha: formatearFechaRelativa(0), // Hoy
    hora: '09:30',
    observaciones: 'Mantenimiento de horquilla Fox 34 SC y amortiguador DPS. Pérdida de aire tras la última salida.',
    notasMecanico: 'Kit de retenes SKF preparado. Revisar bloqueo remoto Squidlock.',
    costeEstimado: 120,
    estado: 'en_proceso',
    creadoEn: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'cita-002',
    nombre: 'Elena Martínez Pardo',
    userEmail: 'elena.mtz@hotmail.com',
    telefono: '633 987 112',
    userId: 'user-mock-2',
    modeloBici: 'Trek Fuel EX 9.8 XT',
    tipoServicio: 'frenos',
    fecha: formatearFechaRelativa(0), // Hoy
    hora: '11:00',
    observaciones: 'Freno trasero con tacto esponjoso y chirrido continuo en bajadas.',
    notasMecanico: 'Posible contaminación de pastillas. Purgar con aceite mineral Shimano.',
    costeEstimado: 45,
    estado: 'pendiente',
    creadoEn: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'cita-003',
    nombre: 'Pablo Navas Serrano',
    userEmail: 'pablo.navas@yahoo.es',
    telefono: '644 556 677',
    userId: 'user-mock-3',
    modeloBici: 'Specialized Epic EVO Comp',
    tipoServicio: 'mantenimiento',
    fecha: formatearFechaRelativa(1), // Mañana
    hora: '10:00',
    observaciones: 'Puesta a punto completa antes de la prueba de los Titanes. Centrado de ruedas y engrase de rodamientos.',
    notasMecanico: '',
    costeEstimado: 85,
    estado: 'confirmada',
    creadoEn: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'cita-004',
    nombre: 'Lucía Fernández Castro',
    userEmail: 'lucia.fc@gmail.com',
    telefono: '699 123 456',
    userId: 'user-mock-4',
    modeloBici: 'Scott Spark RC World Cup',
    tipoServicio: 'transmision',
    fecha: formatearFechaRelativa(2),
    hora: '16:30',
    observaciones: 'El cambio SRAM GX AXS salta en los piñones 3 y 4. Cadena con 1.500 km.',
    notasMecanico: 'Comprobar alineación de patilla de cambio con galga.',
    costeEstimado: 55,
    estado: 'pendiente',
    creadoEn: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'cita-005',
    nombre: 'David Morales Gil',
    userEmail: 'david.mg@outlook.com',
    telefono: '677 889 900',
    userId: 'user-mock-5',
    modeloBici: 'Canyon Spectral 125 CF 8',
    tipoServicio: 'averia',
    fecha: formatearFechaRelativa(-1), // Ayer
    hora: '17:00',
    observaciones: 'Crujido fuerte en la zona del pedalier al pedalear de pie.',
    notasMecanico: 'Desmontado pedalier DUB, rodamientos limpios y re-engrasados con grasa marina. Solucionado.',
    costeEstimado: 40,
    estado: 'completada',
    creadoEn: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'cita-006',
    nombre: 'Javier Soto Varela',
    userEmail: 'javier.soto@terra.es',
    telefono: '611 223 344',
    userId: 'user-mock-6',
    modeloBici: 'Santa Cruz Megatower CC',
    tipoServicio: 'ajustes',
    fecha: formatearFechaRelativa(3),
    hora: '18:00',
    observaciones: 'Ajuste general tras cambiar manillar y potencia.',
    notasMecanico: '',
    costeEstimado: 25,
    estado: 'confirmada',
    creadoEn: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
]
