import { useState, useEffect, useContext } from 'react'
import { api } from './api'
import { LangCtx } from './i18n'
import { money } from './config'

export default function Dashboard({ refs }) {
  const { t } = useContext(LangCtx)
  const [d, setD] = useState(null)
  useEffect(() => {
    Promise.all([api('/report/spending?period=month'), api('/report/fruit'), api('/price'), api('/logs')])
      .then(([sp, fr, pr, lg]) => setD({ sp, fr, pr, lg }))
  }, [])
  if (!d) return <p className="text-mu">...</p>
  const { sp, fr, pr, lg } = d
  const total = sp.rows.reduce((a, r) => a + r.total, 0)
  const cur = sp.rows.find(r => r.p === new Date().toISOString().slice(0, 7))?.total || 0
  const lim = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10)
  const sick = new Set(lg.filter(l => l.kind === 'sick' && l.date >= lim).map(l => l.tree_id)).size
  const ms = sp.rows.slice(0, 6).reverse()
  const mx = Math.max(...ms.map(m => m.total), 1)
  const stats = [['💰', 'spend_total', money(total), '#f59e0b'], ['🗓️', 'spend_month', money(cur), '#0ea5e9'],
    ['🤒', 'sick_now', sick, '#ef4444'], ['🍈', 'fruit_total', fr.total_count, '#22c55e']]
  const code = id => refs.trees.find(x => x.id == id)?.code || '-'

  return (<>
    <div className="hero mb-4 grid grid-cols-2 gap-4 rounded-3xl p-5 shadow-lg md:p-8">
      <div><div className="text-base opacity-90">💵 {t('income_est')}</div><div className="mt-1 text-4xl font-bold">{money(fr.total_kg * pr.price)}</div></div>
      <div><div className="text-base opacity-90">🌳 {t('trees_total')}</div><div className="mt-1 text-4xl font-bold">{refs.trees.length}</div></div>
    </div>

    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(([i, k, v, c]) => <div key={k} className="card !mb-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: c + '33' }}>{i}</div>
        <div className="mt-2 text-base text-mu">{t(k)}</div><div className="text-3xl font-bold">{v}</div></div>)}
    </div>

    <div className="card"><h3 className="mb-3 text-xl font-bold">{t('trend')}</h3>
      {ms.length ? <div className="flex h-48 items-end gap-2 sm:gap-4">{ms.map(m => <div key={m.p} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end text-sm text-mu">
        <span className="truncate">{money(m.total)}</span>
        <div className="w-full rounded-t-xl bg-brand" style={{ height: m.total / mx * 70 + '%', minHeight: 6 }} />
        <span>{m.p.slice(2)}</span></div>)}</div>
        : <p className="p-6 text-center text-lg text-mu">🌱 {t('empty')}</p>}</div>

    <div className="card"><h3 className="mb-2 text-xl font-bold">{t('recent')}</h3>
      {lg.length ? lg.slice(0, 6).map(l => <div key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line py-3">
        <span className={'bdg k-' + l.kind}>{t(l.kind)}</span>
        <b>🌳 {code(l.tree_id)}</b><span className="text-mu">{l.date}</span>
        <span className="w-full text-mu">{[l.sickness, l.medicine, l.fruit_count ? l.fruit_count + ' 🍈' : '', l.note].filter(Boolean).join(' · ')}</span></div>)
        : <p className="p-6 text-center text-lg text-mu">🌱 {t('empty')}</p>}</div>
  </>)
}