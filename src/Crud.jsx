import { useState, useEffect, useContext } from 'react'
import { api } from './api'
import { LangCtx } from './i18n'
import { E, KINDS, ICON, MONEY, money, num } from './config'

export default function Crud({ name, refs, reload }) {
  const { t } = useContext(LangCtx)
  const F = E[name]
  const [rows, setRows] = useState(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState(null)
  const [bulk, setBulk] = useState({ prefix: '', start: 1, end: 100 })
  const [toast, setToast] = useState('')
  const load = () => api('/' + name).then(setRows)
  useEffect(() => { setRows(null); setQ(''); load() }, [name])
  const say = m => { setToast(m); setTimeout(() => setToast(''), 1800) }

  const plain = (f, v) => {
    if (f[1] === 'kind') return v ? t(v) : ''
    if (f[1] === 'sel') return (refs[f[2]].find(x => x.id == v) || {})[f[3] || 'name'] || '-'
    return MONEY.includes(f[0]) ? (v == null ? '' : money(v)) : num(v)
  }
  const cell = (f, v) => f[1] === 'kind' && v ? <span className={'bdg k-' + v}>{t(v)}</span> : plain(f, v)

  const set = (k, v) => setForm(p => {
    const n = { ...p, [k]: v }
    if (k === 'category_id') n.type_id = ''
    if ((k === 'kg' || k === 'price_per_kg') && +n.kg && +n.price_per_kg) n.amount = Math.round(n.kg * n.price_per_kg * 100) / 100
    return n
  })
  const visible = f => !f[4] || f[4].includes(form.kind)
  const save = async e => {
    e.preventDefault()
    const b = {}
    F.forEach(f => {
      const v = form[f[0]]
      b[f[0]] = !visible(f) || v === '' || v == null ? null : (f[1] === 'number' || f[1] === 'sel') ? +v : v
    })
    try {
      const r = form.id ? await api(`/${name}/${form.id}`, 'PUT', b) : await api('/' + name, 'POST', b)
      if (r.error) return alert(t('err'))
      setForm(null); say(t('saved')); load(); reload()
    } catch { alert(t('conn')) }
  }
  const del = async id => {
    if (!confirm(t('confirm'))) return
    await api(`/${name}/${id}`, 'DELETE'); say(t('deleted')); load(); reload()
  }
  const doBulk = async () => { await api('/trees-bulk', 'POST', bulk); say(t('saved')); load(); reload() }
  const newForm = () => setForm({ id: null, date: new Date().toISOString().slice(0, 10), kind: 'fertilizer' })
  const shown = (rows || []).filter(r => F.map(f => plain(f, r[f[0]])).join(' ').toLowerCase().includes(q.toLowerCase()))

  const input = f => {
    const [k, ty] = f, v = form[k] ?? ''
    if (ty === 'sel') {
      let l = refs[f[2]]
      if (k === 'type_id' && form.category_id) l = l.filter(x => x.category_id == form.category_id)
      return <select className="inp" value={v} onChange={e => set(k, e.target.value)}>
        <option value="">-</option>{l.map(o => <option key={o.id} value={o.id}>{o[f[3] || 'name']}</option>)}</select>
    }
    if (ty === 'kind') return <select className="inp" value={v} onChange={e => set(k, e.target.value)}>
      {KINDS.map(x => <option key={x} value={x}>{t(x)}</option>)}</select>
    return <input className="inp" type={ty} step="any" inputMode={ty === 'number' ? 'decimal' : undefined} value={v} onChange={e => set(k, e.target.value)} />
  }

  return (<>
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <h2 className="flex-1 text-3xl font-bold">{ICON[name]} {t(name)}</h2>
      <input className="inp sm:!w-64" placeholder={'🔍 ' + t('search')} value={q} onChange={e => setQ(e.target.value)} />
      <button className="btn-p hidden sm:block" onClick={newForm}>+ {t('add')}</button>
    </div>

    {name === 'trees' && <div className="card flex flex-wrap items-end gap-3">
      <b className="w-full text-lg">{t('bulk')}</b>
      {['prefix', 'start', 'end'].map(k => <label key={k} className="flex-1 text-base font-semibold text-mu" style={{ minWidth: 110 }}>{t(k)}
        <input className="inp mt-1" type={k === 'prefix' ? 'text' : 'number'} value={bulk[k]} onChange={e => setBulk({ ...bulk, [k]: e.target.value })} /></label>)}
      <button className="btn-p" onClick={doBulk}>+ {t('add')}</button>
    </div>}

    <div className="card">
            {rows === null ? <TableRows />
        : !shown.length ? <p className="p-8 text-center text-lg text-mu">🌱 {t('empty')}</p>
        : <table className="rt w-full"><thead><tr>{F.map(f => <th key={f[0]} className="th">{t(f[0])}</th>)}<th /></tr></thead>
          <tbody>{shown.map(r => <tr key={r.id}>
            {F.map(f => <td key={f[0]} data-label={t(f[0])} className="td">{cell(f, r[f[0]])}</td>)}
            <td data-label="" className="td justify-end gap-2 md:text-right">
              <button className="btn !px-3" aria-label={t('edit')} onClick={() => setForm({ ...r })}>✏️ <span className="md:hidden">{t('edit')}</span></button>{' '}
              <button className="btn !px-3 !text-red-500" aria-label={t('delete')} onClick={() => del(r.id)}>🗑 <span className="md:hidden">{t('delete')}</span></button></td></tr>)}</tbody></table>}
    </div>

    <button className="btn-p fixed bottom-28 right-4 z-20 !h-16 !w-16 !rounded-full !p-0 text-4xl shadow-xl sm:hidden" aria-label={t('add')} onClick={newForm}>+</button>

    {form && <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={() => setForm(null)}>
      <form onSubmit={save} onClick={e => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 pb-8 shadow-xl sm:max-w-xl sm:rounded-3xl sm:p-6">
        <h3 className="mb-4 text-2xl font-bold">{t(form.id ? 'edit' : 'add')} · {t(name)}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {F.filter(visible).map(f => <label key={f[0]} className="block text-base font-semibold text-mu">{t(f[0])}<div className="mt-1">{input(f)}</div></label>)}
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" className="btn flex-1" onClick={() => setForm(null)}>{t('cancel')}</button>
          <button className="btn-p flex-1">{t('save')}</button></div>
      </form></div>}

    {toast && <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-brand px-5 py-3 text-base font-bold text-onbrand shadow-xl md:bottom-8">{toast}</div>}
  </>)
}