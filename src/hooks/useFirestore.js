/**
 * useFirestore.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook genérico para operaciones CRUD con Firestore.
 *
 * Uso:
 *   const { addDoc, loading, error } = useFirestore('citas')
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'

export function useFirestore(collectionName) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  /** Añade un nuevo documento a la colección */
  const addDocument = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const ref = await addDoc(collection(db, collectionName), {
        ...data,
        creadoEn: serverTimestamp(),
      })
      return ref
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  /** Añade un valor a un array de un documento (para "unirse a ruta") */
  const appendToArray = useCallback(async (documentId, fieldName, value) => {
    setLoading(true)
    setError(null)
    try {
      const ref = doc(db, collectionName, documentId)
      await updateDoc(ref, {
        [fieldName]: arrayUnion(value),
      })
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  /** Elimina un valor de un array de un documento */
  const removeFromArray = useCallback(async (documentId, fieldName, value) => {
    setLoading(true)
    setError(null)
    try {
      const ref = doc(db, collectionName, documentId)
      await updateDoc(ref, {
        [fieldName]: arrayRemove(value),
      })
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  return { addDocument, appendToArray, removeFromArray, loading, error }
}
