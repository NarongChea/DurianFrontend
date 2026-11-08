import { useState, useEffect, useContext } from 'react'
import { api } from './api'
import { LangCtx } from './i18n'

const fmt = a => a.length > 10 ? a.slice(0, 6).join(', ') + ' … ' + a.slice(-2).join(', ') : a.join(', ')

function Sheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 pb-8 shadow-xl sm:max-w-md sm:rounded-3xl sm:p-6">{children}</div>
    </div>
  )
}

function PasswordSheet({ title, warn, onConfirm, onClose }) {
  const { t } = useContext(LangCtx)
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await onConfirm(pw) }
    catch (x) { const m = t('e_' + x.message); setErr(m.startsWith('e_') ? t('conn') : m); setBusy(false) }
  }
  return (
    <Sheet onClose={onClose}>
      <form onSubmit={submit}>
        <h3 className="mb-1 text-2xl font-bold">🔒 {title}</h3>
        {warn && <p className="mb-3 text-base text-mu">{warn}</p>}
        <p className="mb-2 text-base font-semibold text-mu">{t('pw_title')}</p>
        <div className="flex gap-2">
          <input autoFocus className="inp" type={show ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} />
          <button type="button" className="btn" onClick={() => setShow(!show)}>{show ? t('hide') : t('show')}</button>
        </div>
        {err && <p className="mt-3 rounded-2xl bg-red-500/15 p-3 text-base font-semibold text-red-500">{err}</p>}
        <div className="mt-5 flex gap-3">
          <button type="button" className="btn flex-1" onClick={onClose}>{t('cancel')}</button>
          <button className="btn-p flex-1" disabled={!pw || busy}>{busy ? '...' : t('confirm')}</button>
        </div>
      </form>
    </Sheet>
  )
}

export default function Trees({ reload }) {
  const { t } = useContext(LangCtx)
  const [trees, setTrees] = useState(null)
  const [info, setInfo] = useState({ max: 0, gaps: [] })
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('asc')
  const [count, setCount] = useState(1)
  const [gap, setGap] = useState(null)
  const [pw, setPw] = useState(null)
  const [edit, setEdit] = useState(null)
  const [toast, setToast] = useState('')

  const load = async () => {
    const [a, b] = await Promise.all([api('/trees'), api('/trees-info')])
    setTrees(a); setInfo(b)
  }
  useEffect(() => { load() }, [])
  const say = m => { setToast(m); setTimeout(() => setToast(''), 2500) }
  const after = m => { setPw(null); setGap(null); say(m); load(); reload() }

  const n = Math.min(500, Math.max(0, parseInt(count) || 0))
  const plan = (picked, max) => {
    const fill = [...picked].sort((a, b) => a - b).slice(0, n)
    const rest = []
    for (let i = 1; i <= n - fill.length; i++) rest.push(max + i)
    return [...fill, ...rest]
  }

  const askAdd = (picked, max) => {
    const fill = [...picked].sort((a, b) => a - b).slice(0, n)
    setPw({
      title: t('add_trees'), warn: `${t('will_add')}: ${fmt(plan(fill, max))}`,
      run: async p => {
        const r = await api('/trees-add', 'POST', { count: n, fill_gaps: fill, password: p })
        after(`${t('added')}: ${fmt(r.added)}`)
      },
    })
  }
  const start = async () => {
    if (n < 1) return
    const i = await api('/trees-info'); setInfo(i)
    if (i.gaps.length) setGap({ gaps: i.gaps, max: i.max, picked: i.gaps.slice(0, n) })
    else askAdd([], i.max)
  }
  const askDelete = tr => setPw({
    title: `${t('del_tree')} ${tr.code}`, warn: t('del_warn'),
    run: async p => { await api(`/trees/${tr.id}/delete`, 'POST', { password: p }); after(t('deleted')) },
  })
  const saveNote = async e => {
    e.preventDefault()
    await api(`/trees/${edit.id}`, 'PUT', { note: edit.note })
    setEdit(null); say(t('saved')); load()
  }

  const list = (trees || []).filter(x => (x.code + ' ' + (x.note || '')).toLowerCase().includes(q.toLowerCase()))
  list.sort(
    sort === 'desc' ? (a, b) => b.no - a.no
    : sort === 'new' ? (a, b) => b.id - a.id
    : sort === 'note' ? (a, b) => (!!b.note - !!a.note) || a.no - b.no
    : (a, b) => a.no - b.no)

  return (<>
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <h2 className="flex-1 text-3xl font-bold">🌳 {t('trees')}</h2>
      <select className="inp sm:!w-56" value={sort} onChange={e => setSort(e.target.value)} aria-label={t('sort')}>
        <option value="asc">{t('s_asc')}</option><option value="desc">{t('s_desc')}</option>
        <option value="new">{t('s_new')}</option><option value="note">{t('s_note')}</option>
      </select>
      <input className="inp sm:!w-56" placeholder={'🔍 ' + t('search')} value={q} onChange={e => setQ(e.target.value)} />
    </div>

    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
      <div className="card !mb-0"><div className="text-base text-mu">{t('trees_total')}</div><div className="text-3xl font-bold text-brand">{info.total ?? (trees || []).length}</div></div>
      <div className="card !mb-0"><div className="text-base text-mu">{t('stat_last')}</div><div className="text-3xl font-bold text-brand">{info.max}</div></div>
      <div className="card !mb-0 col-span-2 lg:col-span-1"><div className="text-base text-mu">{t('stat_gaps')}</div>
        <div className="text-xl font-bold">{info.gaps.length ? fmt(info.gaps) : '✅'}</div></div>
    </div>

    <div className="card flex flex-wrap items-end gap-3">
      <label className="text-base font-semibold text-mu">{t('how_many')}
        <input className="inp mt-1 !w-32" type="number" min="1" max="500" inputMode="numeric" value={count} onChange={e => setCount(e.target.value)} /></label>
      <button className="btn-p" onClick={start} disabled={n < 1}>+ {t('add_trees')}</button>
    </div>

    {trees === null
      ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="sk h-36 !rounded-3xl" />)}</div>
      : !list.length ? <p className="card p-8 text-center text-lg text-mu">🌱 {t('empty')}</p>
      : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {list.map(tr => (
            <div key={tr.id} className="card !mb-0 flex flex-col">
              <div className="text-4xl font-bold text-brand">🌳 {tr.no ?? tr.code}</div>
              <div className="my-1 min-h-6 flex-1 truncate text-base text-mu">{tr.note || ''}</div>
              <div className="mt-2 flex gap-2">
                <button className="btn flex-1 !px-2" aria-label={t('edit')} onClick={() => setEdit({ id: tr.id, code: tr.code, note: tr.note || '' })}>✏️</button>
                <button className="btn flex-1 !px-2 !text-red-500" aria-label={t('delete')} onClick={() => askDelete(tr)}>🗑</button>
              </div>
            </div>
          ))}
        </div>}

    {gap && (
      <Sheet onClose={() => setGap(null)}>
        <h3 className="mb-1 text-2xl font-bold">🧩 {t('gaps_title')}</h3>
        <p className="mb-3 text-base text-mu">{t('gaps_text')}</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {gap.gaps.map(g => {
            const on = gap.picked.includes(g)
            return <button type="button" key={g}
              onClick={() => setGap({ ...gap, picked: on ? gap.picked.filter(x => x !== g) : [...gap.picked, g] })}
              className={'min-h-12 min-w-14 cursor-pointer rounded-2xl border-2 px-3 text-lg font-bold ' + (on ? 'border-brand bg-brand text-onbrand' : 'border-line')}>{g}</button>
          })}
        </div>
        <button className="btn mb-3" onClick={() => setGap({ ...gap, picked: gap.gaps })}>{t('select_all')}</button>
        <p className="mb-4 rounded-2xl bg-brand/15 p-3 text-base font-semibold text-brand">{t('will_add')}: {fmt(plan(gap.picked, gap.max))}</p>
        <div className="flex flex-col gap-3">
          <button className="btn-p" disabled={!gap.picked.length} onClick={() => askAdd(gap.picked, gap.max)}>{t('fill_sel')}</button>
          <button className="btn" onClick={() => askAdd([], gap.max)}>{t('no_cont')} {gap.max + 1}</button>
          <button className="btn" onClick={() => setGap(null)}>{t('cancel')}</button>
        </div>
      </Sheet>
    )}

    {pw && <PasswordSheet title={pw.title} warn={pw.warn} onConfirm={pw.run} onClose={() => setPw(null)} />}

    {edit && (
      <Sheet onClose={() => setEdit(null)}>
        <form onSubmit={saveNote}>
          <h3 className="mb-3 text-2xl font-bold">✏️ 🌳 {edit.code}</h3>
          <label className="block text-base font-semibold text-mu">{t('note')}
            <input autoFocus className="inp mt-1" value={edit.note} onChange={e => setEdit({ ...edit, note: e.target.value })} /></label>
          <div className="mt-5 flex gap-3">
            <button type="button" className="btn flex-1" onClick={() => setEdit(null)}>{t('cancel')}</button>
            <button className="btn-p flex-1">{t('save')}</button>
          </div>
        </form>
      </Sheet>
    )}

    {toast && <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-brand px-5 py-3 text-base font-bold text-onbrand shadow-xl md:bottom-8">{toast}</div>}
  </>)
}