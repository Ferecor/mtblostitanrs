/**
 * apiCitas.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cliente frontend para consumir los endpoints REST del backend de administración.
 * Realiza peticiones al backend local de Vite o al host configurado en producción.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { auth } from '@/firebase/firebase'
import { apiUrl } from './apiBaseUrl'

const BASE_URL = '/api/admin/citas'

async function authenticatedFetch(path, options = {}) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Debes iniciar sesión para gestionar las citas')
  }

  const token = await user.getIdToken()
  return fetch(apiUrl(path), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getCitasBackend() {
  const response = await authenticatedFetch(BASE_URL)
  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status}): ${response.statusText}`)
  }
  const data = await response.json()
  return data.citas || []
}

export async function createCitaBackend(citaData) {
  const response = await authenticatedFetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(citaData),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Error al crear la cita en el servidor')
  }
  return response.json()
}

export async function updateCitaBackend(id, campos) {
  const response = await authenticatedFetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campos),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Error al actualizar la cita en el servidor')
  }
  return response.json()
}

export async function updateEstadoBackend(id, nuevoEstado) {
  return updateCitaBackend(id, { estado: nuevoEstado })
}

export async function deleteCitaBackend(id) {
  const response = await authenticatedFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Error al eliminar la cita en el servidor')
  }
  return response.json()
}

export async function enviarConfirmacionEmailBackendAPI(id, destinatario) {
  const response = await authenticatedFetch(`${BASE_URL}/${id}/enviar-confirmacion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destinatario }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Error al enviar el correo desde el backend')
  }
  return response.json()
}
