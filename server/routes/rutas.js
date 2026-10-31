import express from 'express'
import { parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { adminAuth, adminDb } from '../firebaseAdmin.js'
import { enviarEmailConfirmacionRuta, isEmailConfigured } from '../emailSender.js'

const router = express.Router()

router.post('/:id/confirmacion', async (req, res) => {
  if (process.env.NODE_ENV === 'production' && !isEmailConfigured()) {
    return res.status(503).json({ error: 'El envío de correo no está configurado en el servidor' })
  }

  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    return res.status(401).json({ error: 'Se requiere iniciar sesión' })
  }
  if (!adminAuth || !adminDb) {
    return res.status(503).json({ error: 'El servicio de correo no está disponible' })
  }
  try {
    const user = await adminAuth.verifyIdToken(token, true)
    if (!user.email) {
      return res.status(400).json({ error: 'La cuenta no tiene un correo electrónico asociado' })
    }

    const rutaSnapshot = await adminDb.collection('rutas').doc(req.params.id).get()
    if (!rutaSnapshot.exists) {
      return res.status(404).json({ error: 'No se encontró la ruta' })
    }

    const ruta = rutaSnapshot.data()
    if (!Array.isArray(ruta.asistentes) || !ruta.asistentes.includes(user.uid)) {
      return res.status(403).json({ error: 'Debes unirte a la ruta antes de solicitar la confirmación' })
    }

    const fechaRuta = ruta.fechaRaw?.toDate
      ? ruta.fechaRaw.toDate()
      : ruta.fechaRaw
        ? new Date(ruta.fechaRaw)
        : ruta.fecha
          ? parse(ruta.fecha, "d 'de' MMMM", new Date(), { locale: es })
          : null
    if (!fechaRuta || Number.isNaN(fechaRuta.getTime()) || fechaRuta < startOfToday()) {
      return res.status(400).json({ error: 'La ruta ya no está activa' })
    }

    const resultado = await enviarEmailConfirmacionRuta({
      destinatario: user.email,
      nombreUsuario: user.name,
      ruta,
    })

    return res.json({ success: true, simulado: Boolean(resultado.simulado) })
  } catch (error) {
    console.error('No se pudo enviar la confirmación de ruta:', error)
    const status = error.code === 'EMAIL_NOT_CONFIGURED' ? 503 : 500
    return res.status(status).json({
      error: status === 503
        ? 'El envío de correo no está configurado en el servidor'
        : 'No se pudo enviar el correo de confirmación',
    })
  }
})

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export default router
