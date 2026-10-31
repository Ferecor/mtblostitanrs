import { useEffect, useState } from 'react'
import { Check, Copy, ExternalLink, Mail, Send, X } from 'lucide-react'
import {
  abrirMailto,
  getGmailWebUrl,
  getOutlookWebUrl,
} from '@/services/emailService'

function getEmailContent(ruta, nombre) {
  const routeName = ruta.nombre || 'Ruta MTB Los Titanes'
  const subject = `Confirmación de inscripción — ${routeName}`
  const body = [
    `Hola ${nombre || 'Ciclista'},`,
    '',
    `¡Te has unido correctamente a la ruta ${routeName}!`,
    '',
    `Fecha: ${ruta.fecha || 'Fecha por confirmar'}`,
    `Distancia: ${ruta.distanciaKm ?? 0} km`,
    `Desnivel: +${ruta.desnivel ?? 0} m`,
    `Dificultad: ${ruta.dificultad || 'Sin especificar'}`,
    ruta.descripcion ? `Descripción: ${ruta.descripcion}` : '',
    '',
    '¡Nos vemos en la montaña!',
    'El equipo de MTB Los Titanes',
  ].filter(Boolean).join('\n')

  return { subject, body }
}

export default function AdminRutaEmailModal({ ruta, attendee, onClose, onSendBackend }) {
  const [recipient, setRecipient] = useState(attendee?.email || '')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ruta || !attendee) return
    const content = getEmailContent(ruta, attendee.nombre)
    setRecipient(attendee.email || '')
    setSubject(content.subject)
    setBody(content.body)
    setError('')
    setCopied(false)
  }, [ruta, attendee])

  if (!ruta || !attendee) return null

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(`Para: ${recipient}\nAsunto: ${subject}\n\n${body}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch (copyError) {
      console.error('No se pudo copiar el correo:', copyError)
      setError('No se pudo copiar al portapapeles.')
    }
  }

  const sendFromBackend = async () => {
    setSending(true)
    setError('')
    try {
      await onSendBackend(ruta, attendee, recipient)
      onClose()
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setSending(false)
    }
  }

  const openMailClient = (openUrl) => {
    if (!recipient) return
    openUrl(recipient, subject, body)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-route-email-title"
        className="my-6 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-soft bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-soft bg-gray-ultra/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
              <Mail size={20} />
            </div>
            <div>
              <h2 id="admin-route-email-title" className="text-lg font-black text-dark">
                Confirmación de inscripción
              </h2>
              <p className="text-xs text-gray-mid">
                {attendee.nombre} · {ruta.nombre}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-mid hover:bg-gray-soft hover:text-dark"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-dark">
            Para
            <input
              type="email"
              required
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-soft bg-gray-ultra px-3 py-2 text-sm font-medium normal-case tracking-normal text-dark focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wide text-gray-dark">
            Asunto
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-soft bg-gray-ultra px-3 py-2 text-sm font-medium normal-case tracking-normal text-dark focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wide text-gray-dark">
            Mensaje
            <textarea
              rows={11}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="mt-1 w-full resize-y rounded-xl border border-gray-soft bg-gray-ultra p-3 text-sm font-normal normal-case leading-relaxed tracking-normal text-gray-dark focus:border-accent focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Correo copiado' : 'Copiar correo'}
          </button>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </div>

        <footer className="flex flex-wrap justify-end gap-2 border-t border-gray-soft bg-gray-ultra/40 px-6 py-4">
          <button
            type="button"
            onClick={() => openMailClient(getGmailWebUrl)}
            disabled={!recipient}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Gmail Web <ExternalLink size={13} />
          </button>
          <button
            type="button"
            onClick={() => openMailClient(getOutlookWebUrl)}
            disabled={!recipient}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            Outlook <ExternalLink size={13} />
          </button>
          <button
            type="button"
            onClick={() => openMailClient(abrirMailto)}
            disabled={!recipient}
            className="rounded-xl bg-dark px-3.5 py-2.5 text-xs font-bold text-white hover:bg-gray-dark disabled:opacity-50"
          >
            App de correo
          </button>
          <button
            type="button"
            onClick={sendFromBackend}
            disabled={!recipient || sending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            <Send size={13} />
            {sending ? 'Enviando…' : 'Enviar desde Backend'}
          </button>
        </footer>
      </section>
    </div>
  )
}
