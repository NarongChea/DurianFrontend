import { useState, useEffect, useContext } from 'react'
import { api } from './api'
import { LangCtx } from './i18n'
import { money, num } from './config'
import { ReportsSkeleton } from './Skeleton'
export default function Reports() {
  const { t } = useContext(LangCtx)
  const [period, setPeriod] = useState('day')
  const [sp, setSp] = useState(null)
  const [fr, setFr] = useState(null)
  const [price, setPrice] = useState(0)
  useEffect(() => { api('/report/spending?period=' + period).then(setSp) }, [period])
  useEffect(() => { api('/report/fruit').then(setFr); api('/price').then(r => setPrice(r.price)) }, [])
    if (!sp || !fr) return <ReportsSkeleton />
  const Stat = ({ k, children }) => <div className="card !mb-0">
    <div className="text-base text-mu">{t(k)}</div><div className="text-3xl font-bold text-brand">{children}</div></div>

  return (<>
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <h2 className="flex-1 text-3xl font-bold">📈 {t('reports')}</h2>
      <select className="inp sm:!w-auto" value={period} onChange={e => setPeriod(e.target.value)}>
        {['day', 'week', 'month', 'year'].map(x => <option key={x} value={x}>{t(x)}</option>)}</select>
    </div>

    <div className="card"><h3 className="mb-2 text-xl font-bold">{t('total')}: {money(sp.rows.reduce((a, r) => a + r.total, 0))}</h3>
      <table className="w-full"><thead><tr><th className="th">{t(period)}</th><th className="th">{t('kg')}</th><th className="th">{t('total')}</th></tr></thead>
        <tbody>{sp.rows.map(r => <tr key={r.p}><td className="td">{r.p}</td><td className="td">{num(r.kg)}</td><td className="td font-bold">{money(r.total)}</td></tr>)}</tbody></table></div>

    <div className="card"><h3 className="mb-2 text-xl font-bold">{t('bycat')}</h3>
      <table className="w-full"><tbody>{sp.by_category.map((r, i) => <tr key={i}><td className="td">{r.p}</td><td className="td">{r.category}</td><td className="td font-bold">{money(r.total)}</td></tr>)}</tbody></table></div>

    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Stat k="totalcount">{fr.total_count}</Stat>
      <Stat k="totalkg">{num(fr.total_kg)}</Stat>
      <Stat k="avgw">{num(fr.avg_kg)}</Stat>
      <div className="card !mb-0"><div className="mb-1 text-base text-mu">{t('price')}</div>
        <input className="inp" type="number" step="any" inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} onBlur={() => api('/price', 'PUT', { price: +price })} /></div>
      <Stat k="income">{money(fr.total_kg * (+price || 0))}</Stat>
    </div>

    <div className="card"><h3 className="mb-2 text-xl font-bold">{t('pertree')}</h3>
      <table className="w-full"><thead><tr><th className="th">{t('tree_id')}</th><th className="th">{t('fruit_count')}</th><th className="th">{t('weight_kg')}</th></tr></thead>
        <tbody>{fr.trees.map(r => <tr key={r.code}><td className="td">{r.code}</td><td className="td">{r.count}</td><td className="td">{num(r.kg)}</td></tr>)}</tbody></table></div>
  </>)
}