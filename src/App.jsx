import { useState, useEffect, useCallback } from 'react'
import { T, LangCtx } from './i18n'
import { PAGES, ICON } from './config'
import { api, API_URL } from './api'
import Crud from './Crud'
import Dashboard from './Dashboard'
import Reports from './Reports'
import Login from './Login'
import Settings from './Settings'

const SIZES = [17, 20, 24]

export default function App() {
  const [lang, setLang] = useState(localStorage.lang || 'km')
  const [page, setPage] = useState('dash')
  const [refs, setRefs] = useState(null)
  const [err, setErr] = useState(false)
  const [authed, setAuthed] = useState(!!localStorage.token)
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'))
  const [size, setSize] = useState(+localStorage.size || 20)
  const t = k => T[lang][k] || T.en[k] || k

  const reload = useCallback(async () => {
    try {
      const [trees, categories, types] = await Promise.all(['trees', 'categories', 'types'].map(n => api('/' + n)))
      setRefs({ trees, categories, types }); setErr(false)
    } catch { setErr(true) }
  }, [])
  useEffect(() => { if (authed) reload() }, [authed, reload])
  useEffect(() => {
    const h = () => { setAuthed(false); setRefs(null) }
    window.addEventListener('auth-expired', h)
    return () => window.removeEventListener('auth-expired', h)
  }, [])
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.theme = dark ? 'dark' : 'light' }, [dark])
  useEffect(() => { document.documentElement.style.fontSize = size + 'px'; localStorage.size = size }, [size])
  useEffect(() => { window.scrollTo(0, 0) }, [page])
  const changeLang = v => { setLang(v); localStorage.lang = v }
  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    setAuthed(false); setRefs(null); setPage('dash')
  }

  if (!authed) return (
    <LangCtx.Provider value={{ t, lang }}>
      <Login onLogin={() => setAuthed(true)} lang={lang} changeLang={changeLang} />
    </LangCtx.Provider>
  )

  return (
    <LangCtx.Provider value={{ t, lang }}>
      <div className="md:flex">
        <nav className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t-2 border-line bg-card pb-[env(safe-area-inset-bottom)] md:sticky md:inset-x-auto md:bottom-auto md:top-0 md:h-screen md:w-72 md:shrink-0 md:flex-col md:gap-1 md:overflow-y-auto md:border-r-2 md:border-t-0 md:p-4">
          <div className="hidden px-3 py-4 text-xl font-bold md:block">🌿 {t('title')}</div>
          {PAGES.map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={'flex min-w-[80px] flex-1 cursor-pointer flex-col items-center gap-0.5 px-2 py-2 text-[13px] md:min-w-0 md:flex-none md:flex-row md:gap-3 md:rounded-2xl md:px-4 md:py-3 md:text-lg ' +
                (p === page ? 'bg-brand/15 font-bold text-brand' : 'text-mu hover:bg-brand/10')}>
              <span className="text-2xl md:text-xl">{ICON[p]}</span>{t(p)}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center gap-2 border-b-2 border-line bg-card/95 px-3 py-2 backdrop-blur md:justify-end md:px-8">
            <span className="flex-1 truncate text-lg font-bold md:hidden">🌿 {t('title')}</span>
            <div className="flex gap-1">
              {SIZES.map((s, i) => (
                <button key={s} aria-label="text size" onClick={() => setSize(s)}
                  className={'ibtn ' + (s === size ? '!border-brand !bg-brand !text-onbrand' : '')}
                  style={{ fontSize: [14, 18, 23][i] }}>A</button>
              ))}
            </div>
            <button className="ibtn text-xl" aria-label="theme" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
            <select className="inp !w-auto !min-h-11 !py-1" value={lang} onChange={e => changeLang(e.target.value)}>
              <option value="km">ខ្មែរ</option><option value="en">EN</option>
            </select>
            <button className="btn !min-h-11 !px-3" onClick={logout}>🚪 <span className="hidden sm:inline">{t('logout')}</span></button>
          </header>

          <main className="mx-auto w-full max-w-6xl p-4 pb-36 md:p-8 md:pb-10">
            {page === 'settings' ? <Settings key={page} />
            : err ? (
              <div className="card py-10 text-center">
                <h2 className="text-2xl font-bold">⚠️ {t('conn')}</h2>
                <p className="my-2 break-all text-mu">{API_URL}</p>
                <p>{t('connhelp')}</p>
                <code className="mx-auto my-4 block max-w-sm rounded-2xl bg-bg p-3 text-left text-base">cd backend<br />uvicorn main:app --reload --port 8000</code>
                <button className="btn-p" onClick={reload}>{t('retry')}</button>
              </div>
            ) : !refs ? <p className="text-mu">...</p>
            : page === 'dash' ? <Dashboard key={page} refs={refs} />
            : page === 'reports' ? <Reports key={page} />
            : <Crud key={page} name={page} refs={refs} reload={reload} />}
          </main>
        </div>
      </div>
    </LangCtx.Provider>
  )
}