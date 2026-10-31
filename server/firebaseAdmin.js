/**
 * server/firebaseAdmin.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Inicialización de Firebase Admin SDK con credenciales de cuenta de servicio.
 * Provee acceso administrativo completo (bypassa reglas cliente de Firestore).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.resolve(__dirname, '../mtb-lostitanes-firebase-adminsdk-fbsvc-f584359c71.json')

const existingApp = getApps().find((app) => app.name === '[DEFAULT]')
let adminApp = existingApp

if (!adminApp) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || 'mtb-lostitanes',
    })
    console.log('✅ Firebase Admin SDK inicializado con clave de cuenta de servicio')
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `No se encontró el archivo de clave de cuenta de servicio en ${serviceAccountPath}. ` +
        'Configura GOOGLE_APPLICATION_CREDENTIALS como archivo secreto en el servicio.'
      )
    }

    console.warn('⚠️ No se encontró el archivo de clave de cuenta de servicio en:', serviceAccountPath)
    adminApp = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'mtb-lostitanes',
    })
  }
}

export const adminDb = getFirestore(adminApp)
export const adminAuth = getAuth(adminApp)
export default adminApp
