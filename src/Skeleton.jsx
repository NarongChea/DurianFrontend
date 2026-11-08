import { useState, useEffect, useContext } from 'react'
import { LangCtx } from './i18n'

export const Sk = ({ className = '', style }) => <div className={'sk ' + className} style={style} />

function Wake() {
  const { t } = useContext(LangCtx)
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 5000)
    return () => clearTimeout(id)
  }, [])
  return slow
    ? <p role="status" className="mb-4 rounded-2xl bg-brand/15 p-3 text-center text-base font-semibold text-brand">⏳ {t('waking')}</p>
    : null
}

export function TableRows({ n = 6 }) {
  return (
    <div aria-busy="true">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-t border-line py-4 first:border-0">
          <Sk className="h-5 w-1/4" />
          <Sk className="h-5 flex-1" />
          <Sk className="hidden h-5 w-1/6 sm:block" />
          <Sk className="h-10 w-20" />
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true">
      <Wake />
      <Sk className="mb-4 h-32 !rounded-3xl md:h-40" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map(i => <Sk key={i} className="h-36 !rounded-3xl" />)}
      </div>
      <div className="card">
        <Sk className="mb-4 h-6 w-1/3" />
        <div className="flex h-48 items-end gap-3">
          {[40, 65, 30, 80, 55, 70].map((h, i) => <Sk key={i} className="flex-1 !rounded-b-none" style={{ height: h + '%' }} />)}
        </div>
      </div>
      <div className="card"><Sk className="mb-3 h-6 w-1/4" /><TableRows n={4} /></div>
    </div>
  )
}

export function ReportsSkeleton() {
  return (
    <div aria-busy="true">
      <Wake />
      <div className="mb-4 flex items-center gap-3"><Sk className="h-9 w-48 flex-1 sm:flex-none" /><Sk className="h-12 w-32" /></div>
      <div className="card"><Sk className="mb-3 h-6 w-1/3" /><TableRows n={4} /></div>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map(i => <Sk key={i} className="h-28 !rounded-3xl" />)}
      </div>
      <div className="card"><Sk className="mb-3 h-6 w-1/4" /><TableRows n={3} /></div>
    </div>
  )
}

export function PageSkeleton({ page }) {
  if (page === 'dash') return <DashboardSkeleton />
  if (page === 'reports') return <ReportsSkeleton />
  if (page === 'settings') return <div className="card"><Sk className="mb-4 h-8 w-1/3" /><Sk className="mb-3 h-12 w-full max-w-xl" /><Sk className="h-12 w-full max-w-xl" /></div>
  return (
    <div aria-busy="true">
      <Wake />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Sk className="h-9 w-48 flex-1 sm:flex-none" /><div className="hidden flex-1 sm:block" />
        <Sk className="h-12 w-full sm:w-64" /><Sk className="hidden h-12 w-32 sm:block" />
      </div>
      <div className="card"><TableRows n={6} /></div>
    </div>
  )
}