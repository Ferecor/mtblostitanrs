import { auth } from '@/firebase/firebase'
import { apiUrl } from './apiBaseUrl'

export async function enviarConfirmacionRuta(rutaId) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Debes iniciar sesión para unirte a una ruta')
  }

  const token = await user.getIdToken()
  const response = await fetch(apiUrl(`/api/rutas/${encodeURIComponent(rutaId)}/confirmacion`), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.error || 'No se pudo enviar el correo de confirmación')
  }

  return response.json()
}
