/**
 * firebase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Inicialización central de Firebase para MTB Tinanes.
 *
 * USO:
 *   import { auth, db } from '@/firebase/firebase'
 *
 * CONFIGURACIÓN:
 *   1. Crea un proyecto en https://console.firebase.google.com
 *   2. Copia .env.example → .env.local
 *   3. Rellena las variables VITE_FIREBASE_* con tus credenciales
 *   4. Activa "Email/Password" en Authentication → Sign-in method
 *   5. Crea la base de datos en Firestore Database
 *   6. Despliega las reglas de seguridad desde firestore.rules
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp } from 'firebase/app'
import {
  CustomProvider,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from 'firebase/app-check'
import { getAuth }        from 'firebase/auth'
import { getFirestore }   from 'firebase/firestore'

// ── Configuración del proyecto Firebase ──────────────────────────────────────
// Las variables VITE_* son leídas automáticamente por Vite desde .env.local
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// ── Inicialización (singleton — Firebase lo gestiona internamente) ─────────────
const app = initializeApp(firebaseConfig)

const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY

if (import.meta.env.DEV) {
  globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = true
  initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: async () => {
        throw new Error('El proveedor App Check de desarrollo requiere el token debug de Firebase.')
      },
    }),
    isTokenAutoRefreshEnabled: true,
  })
} else if (appCheckSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
}

// ── Exports nombrados ────────────────────────────────────────────────────────
export const auth = getAuth(app)
export const db   = getFirestore(app)
export default app
