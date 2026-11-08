export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export async function api(path, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.token
  if (token) headers.Authorization = 'Bearer ' + token
  const r = await fetch(API_URL + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (!r.ok) {
    let d = ''
    try { d = (await r.json()).detail } catch {}
    if (r.status === 401 && token) {
      localStorage.removeItem('token'); localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth-expired'))
    }
    const e = new Error(typeof d === 'string' && d ? d : 'HTTP ' + r.status)
    e.status = r.status
    throw e
  }
  return r.json()
}