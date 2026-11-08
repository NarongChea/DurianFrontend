import { useState, useEffect, useContext } from 'react'
import { api } from './api'
import { LangCtx } from './i18n'

const RULES = [['r_len', /^[\s\S]{12,64}$/], ['r_up', /[A-Z]/], ['r_low', /[a-z]/], ['r_dig', /\d/], ['r_sym', /[^A-Za-z0-9]/]]

export default function Settings() {
  const { t } = useContext(LangCtx)
  const [me, setMe] = useState(null)
  const [f, setF] = useState({ old: '', otp: '', nw: '', cf: '' })
  const [sent, setSent] = useState(false)
  const [show, setShow] = useState(false)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => { api('/me').then(setMe).catch(() => {}) }, [])

  const set = k => e => setF({ ...f, [k]: e.target.value })
  const strong = RULES.every(([, re]) => re.test(f.nw))
  const ready = sent && strong && f.nw === f.cf && /^\d{6}$/.test(f.otp) && f.old
  const fail = x => setMsg({ ok: false, text: x.status ? t('e_' + x.message) : t('conn') })

  const sendOtp = async () => {
    setBusy(true); setMsg(null)
    try { await api('/password/request-otp', 'POST'); setSent(true); setMsg({ ok: true, text: `${t('otp_sent')} ${me?.email || ''}` }) }
    catch (x) { fail(x) }
    setBusy(false)
  }
  const submit = async e => {
    e.preventDefault(); setBusy(true); setMsg(null)
    try {
      const r = await api('/password/change', 'POST', { old_password: f.old, otp: f.otp, new_password: f.nw })
      localStorage.token = r.token
      setF({ old: '', otp: '', nw: '', cf: '' }); setSent(false); setMsg({ ok: true, text: '✅ ' + t('pw_changed') })
    } catch (x) { fail(x) }
    setBusy(false)
  }
  const type = show ? 'text' : 'password'

  return (<>
    <h2 className="mb-4 text-3xl font-bold">⚙️ {t('settings')}</h2>
    <div className="card"><div className="text-base text-mu">{t('account')}</div>
      <div className="text-2xl font-bold">👤 {me?.username}</div><div className="text-mu">{me?.email}</div></div>

    <div className="card">
      <h3 className="mb-1 text-xl font-bold">{t('change_pw')}</h3>
      <p className="mb-3 text-base text-mu">{t('step1')}</p>
      <button className="btn-p" onClick={sendOtp} disabled={busy}>📧 {t('send_otp')}</button>

      <form onSubmit={submit} className={'mt-6 grid max-w-xl gap-4 ' + (sent ? '' : 'pointer-events-none opacity-40')}>
        <p className="text-base text-mu">{t('step2')}</p>
        <label className="block text-base font-semibold text-mu">{t('otp')}
          <input className="inp mt-1 tracking-widest" inputMode="numeric" maxLength={6} value={f.otp} onChange={set('otp')} /></label>
        <label className="block text-base font-semibold text-mu">{t('old_pw')}
          <input className="inp mt-1" type={type} autoComplete="current-password" value={f.old} onChange={set('old')} /></label>
        <label className="block text-base font-semibold text-mu">{t('new_pw')}
          <input className="inp mt-1" type={type} autoComplete="new-password" value={f.nw} onChange={set('nw')} /></label>
        <ul className="grid gap-1 text-base sm:grid-cols-2">
          {RULES.map(([k, re]) => <li key={k} className={re.test(f.nw) ? 'text-brand' : 'text-mu'}>{re.test(f.nw) ? '✅' : '⬜'} {t(k)}</li>)}
        </ul>
        <label className="block text-base font-semibold text-mu">{t('confirm_pw')}
          <input className="inp mt-1" type={type} autoComplete="new-password" value={f.cf} onChange={set('cf')} /></label>
        {f.cf && f.nw !== f.cf && <p className="font-semibold text-red-500">{t('mismatch')}</p>}
        <div className="flex gap-3">
          <button type="button" className="btn" onClick={() => setShow(!show)}>{show ? t('hide') : t('show')}</button>
          <button className="btn-p flex-1" disabled={!ready || busy}>{t('change_pw')}</button></div>
      </form>

      {msg && <p className={'mt-4 rounded-2xl p-3 text-base font-semibold ' + (msg.ok ? 'bg-brand/15 text-brand' : 'bg-red-500/15 text-red-500')}>{msg.text}</p>}
    </div>
  </>)
}