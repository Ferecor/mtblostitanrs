/**
 * server/routes/citas.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Rutas del API REST para la administración de citas del taller.
 * Conectado a Firestore mediante Firebase Admin SDK (acceso con privilegios).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import express from 'express'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '../firebaseAdmin.js'
import { enviarEmailConfirmacionBackend, isEmailConfigured } from '../emailSender.js'

const router = express.Router()

// ── GET /api/admin/citas — Listar todas las citas ─────────────────────────────
router.get('/', async (req, res) => {
  try {
    if (!adminDb) {
      return res.status(503).json({
        error: 'Base de datos no inicializada en el backend',
        citas: [],
      })
    }

    const snapshot = await adminDb.collection('citas').orderBy('fecha', 'desc').get()
    const citas = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        creadoEn: data.creadoEn?.toDate ? data.creadoEn.toDate().toISOString() : data.creadoEn,
        actualizadoEn: data.actualizadoEn?.toDate ? data.actualizadoEn.toDate().toISOString() : data.actualizadoEn,
      }
    })

    return res.json({ success: true, count: citas.length, citas })
  } catch (error) {
    console.error('❌ Error al obtener citas en el backend:', error)
    return res.status(500).json({ error: error.message })
  }
})

// ── GET /api/admin/citas/:id — Obtener una cita específica ───────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const docRef = adminDb.collection('citas').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Cita no encontrada' })
    }

    return res.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// ── POST /api/admin/citas — Crear nueva cita manual desde el admin ────────────
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      userEmail,
      telefono,
      modeloBici,
      tipoServicio,
      fecha,
      hora,
      observaciones,
      notasMecanico,
      costeEstimado,
      estado,
    } = req.body

    if (!nombre || !fecha) {
      return res.status(400).json({ error: 'El nombre y la fecha son obligatorios' })
    }

    const nuevaCita = {
      nombre,
      userEmail: userEmail || '',
      telefono: telefono || '',
      modeloBici: modeloBici || '',
      tipoServicio: tipoServicio || 'mantenimiento',
      fecha,
      hora: hora || '10:00',
      observaciones: observaciones || '',
      notasMecanico: notasMecanico || '',
      costeEstimado: costeEstimado !== undefined && costeEstimado !== null && costeEstimado !== '' ? Number(costeEstimado) : null,
      estado: estado || 'confirmada',
      creadoPorAdmin: true,
      confirmacionEnviada: false,
      creadoEn: FieldValue.serverTimestamp(),
    }

    const docRef = await adminDb.collection('citas').add(nuevaCita)
    console.log(`✅ Cita creada en backend con ID: ${docRef.id}`)

    return res.status(201).json({
      success: true,
      id: docRef.id,
      cita: { id: docRef.id, ...nuevaCita },
    })
  } catch (error) {
    console.error('❌ Error al crear cita en el backend:', error)
    return res.status(500).json({ error: error.message })
  }
})

// ── PUT /api/admin/citas/:id — Actualizar campos o estado de una cita ─────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const camposPermitidos = [
      'nombre',
      'userEmail',
      'telefono',
      'modeloBici',
      'tipoServicio',
      'fecha',
      'hora',
      'observaciones',
      'notasMecanico',
      'costeEstimado',
      'estado',
      'confirmacionEnviada',
      'fechaEnvioConfirmacion',
      'ultimoEmailEnviadoA',
    ]

    const updateData = {
      actualizadoEn: FieldValue.serverTimestamp(),
    }

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        updateData[campo] = req.body[campo]
      }
    })

    const docRef = adminDb.collection('citas').doc(id)
    await docRef.update(updateData)

    console.log(`🔄 Cita ${id} actualizada en backend`)
    return res.json({ success: true, id, actualizados: updateData })
  } catch (error) {
    console.error('❌ Error al actualizar cita:', error)
    return res.status(500).json({ error: error.message })
  }
})

// ── DELETE /api/admin/citas/:id — Eliminar cita ──────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await adminDb.collection('citas').doc(id).delete()
    console.log(`🗑️ Cita ${id} eliminada en backend`)
    return res.json({ success: true, message: 'Cita eliminada correctamente' })
  } catch (error) {
    console.error('❌ Error al eliminar cita:', error)
    return res.status(500).json({ error: error.message })
  }
})

// ── POST /api/admin/citas/:id/enviar-confirmacion — Envío de email al cliente ─
router.post('/:id/enviar-confirmacion', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production' && !isEmailConfigured()) {
      return res.status(503).json({ error: 'El envío de correo no está configurado en el servidor' })
    }

    const { id } = req.params
    const docRef = adminDb.collection('citas').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Cita no encontrada en la base de datos' })
    }

    const cita = { id: docSnap.id, ...docSnap.data() }

    // Determinar destinatario: correo recibido en body o el email del usuario registrado en la cita
    const destinatario = req.body.destinatario || cita.userEmail

    if (!destinatario) {
      return res.status(400).json({
        error: 'No se encontró una dirección de correo para este usuario',
      })
    }

    // Enviar el correo desde el backend
    const resultadoEnvio = await enviarEmailConfirmacionBackend({
      destinatario,
      nombreCliente: cita.nombre,
      fecha: cita.fecha,
      hora: cita.hora,
      modeloBici: cita.modeloBici,
      servicio: cita.tipoServicio,
      costeEstimado: cita.costeEstimado,
      observaciones: cita.observaciones,
      notasMecanico: cita.notasMecanico,
    })

    // Actualizar registro en Firestore
    const fechaEnvio = new Date().toISOString()
    await docRef.update({
      confirmacionEnviada: true,
      fechaEnvioConfirmacion: fechaEnvio,
      ultimoEmailEnviadoA: destinatario,
      actualizadoEn: FieldValue.serverTimestamp(),
    })

    return res.json({
      success: true,
      message: `Correo de confirmación enviado exitosamente a ${destinatario}`,
      destinatario,
      fechaEnvio,
      detalles: resultadoEnvio,
    })
  } catch (error) {
    console.error('❌ Error al enviar confirmación por email en backend:', error)
    const status = error.code === 'EMAIL_NOT_CONFIGURED' ? 503 : 500
    return res.status(status).json({ error: error.message })
  }
})

export default router
