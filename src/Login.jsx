import { useState, useContext } from 'react'
import { api } from './api'
import { LangCtx } from './i18n'

export default function Login({ onLogin, lang, changeLang }) {
  const { t } = useContext(LangCtx)
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      const r = await api('/login', 'POST', { username: u.trim(), password: p })
      localStorage.token = r.token; localStorage.user = r.username
      onLogin()
    } catch (x) { setErr(x.status ? t('e_' + x.message) : t('conn')) }
    setBusy(false)
  }

  return (
    <div className="hero flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="card !mb-0 w-full max-w-md !p-7 shadow-2xl">
        <div className="mb-1 text-center text-5xl">🌿</div>
        <h1 className="mb-6 text-center text-2xl font-bold">{t('title')}</h1>
        <label className="mb-4 block text-base font-semibold text-mu">{t('username')}
          <input className="inp mt-1" autoComplete="username" autoCapitalize="none" value={u} onChange={e => setU(e.target.value)} required /></label>
        <label className="mb-2 block text-base font-semibold text-mu">{t('password')}
          <div className="mt-1 flex gap-2">
            <input className="inp" type={show ? 'text' : 'password'} autoComplete="current-password" value={p} onChange={e => setP(e.target.value)} required />
            <button type="button" className="btn" onClick={() => setShow(!show)}>{show ? t('hide') : t('show')}</button>
          </div></label>
        {err && <p className="my-3 rounded-2xl bg-red-500/15 p-3 text-base font-semibold text-red-500">{err}</p>}
        <button className="btn-p mt-4 w-full !text-lg" disabled={busy}>{busy ? '...' : t('login')}</button>
        <select className="inp mt-4" value={lang} onChange={e => changeLang(e.target.value)}>
          <option value="km">ខ្មែរ</option><option value="en">English</option></select>
      </form>
    </div>
  )
}