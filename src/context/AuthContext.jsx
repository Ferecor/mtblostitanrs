/**
 * AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Context API de autenticación para MTB Tinanes.
 *
 * Provee:
 *   - currentUser   → objeto User de Firebase (null si no logueado)
 *   - loading       → true mientras Firebase verifica la sesión al arrancar
 *   - login(email, password)
 *   - register(email, password, displayName)
 *   - logout()
 *
 * Uso:
 *   import { useAuth } from '@/context/AuthContext'
 *   const { currentUser, login, logout } = useAuth()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'

import { auth } from '@/firebase/firebase'

// ── Creación del contexto ─────────────────────────────────────────────────────
const AuthContext = createContext(null)

const ADMIN_EMAILS = new Set([
  'admin@mtbtinanes.com',
  'taller@mtbtinanes.com',
  'ferecorweb@gmail.com',
  'mtblostitanes@gmail.com',
])

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser,   setCurrentUser]   = useState(null)
  const [loading,       setLoading]       = useState(true) // espera al onAuthStateChanged inicial
  const [emailVerified, setEmailVerified] = useState(false)

  const refreshCurrentUser = useCallback(async () => {
    const user = auth.currentUser
    if (!user) {
      setCurrentUser(null)
      setEmailVerified(false)
      return false
    }

    try {
      await user.reload()
      if (auth.currentUser?.uid === user.uid) {
        setCurrentUser(auth.currentUser)
        const verified = Boolean(auth.currentUser.emailVerified)
        setEmailVerified(verified)
        return verified
      }
      return false
    } catch (error) {
      console.warn('No se pudo actualizar el estado de verificación del usuario:', error)
      return false
    }
  }, [])

  // ── Observador de sesión ────────────────────────────────────────────────────
  useEffect(() => {
    let active = true
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setEmailVerified(Boolean(user?.emailVerified))

      try {
        if (user) {
          await user.reload()
          if (active && auth.currentUser?.uid === user.uid) {
            setCurrentUser(auth.currentUser)
            setEmailVerified(Boolean(auth.currentUser.emailVerified))
          }
        }
      } catch (error) {
        console.warn('No se pudo actualizar el estado de verificación del usuario:', error)
      } finally {
        if (active) setLoading(false)
      }
    })

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshCurrentUser()
      }
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      active = false
      unsubscribe()
      window.removeEventListener('focus', handleFocus)
    }
  }, [refreshCurrentUser])

  // ── Registro ────────────────────────────────────────────────────────────────
  const register = useCallback(async (email, password, displayName) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    // Actualizar displayName en el perfil de Firebase Auth
    if (displayName) {
      await updateProfile(credential.user, { displayName })
    }
    return credential
  }, [])

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }, [])

  const sendVerificationEmail = useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error('Debes iniciar sesión para solicitar la verificación del correo.')
    }

    await sendEmailVerification(auth.currentUser)
  }, [])

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => signOut(auth), [])

  // ── Cálculo de rol Admin ────────────────────────────────────────────────────
  const emailLower = currentUser?.email?.toLowerCase() ?? ''
  const isAdminEmail = ADMIN_EMAILS.has(emailLower)
  const isAdmin = Boolean(emailVerified && isAdminEmail)

  // ── Valor del contexto ──────────────────────────────────────────────────────
  const value = {
    currentUser,
    loading,
    emailVerified,
    isAdminEmail,
    isAdmin,
    refreshCurrentUser,
    sendVerificationEmail,
    register,
    login,
    logout,
  }

  // No renderizamos los hijos hasta que Firebase haya respondido
  // para evitar un parpadeo de estado "no autenticado" al recargar
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// ── Hook de consumo ───────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return context
}
