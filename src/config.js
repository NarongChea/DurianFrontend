export const KINDS = ['fertilizer', 'sick', 'flower', 'fruit']
export const MONEY = ['amount', 'price_per_kg']
export const PAGES = ['dash', 'trees', 'spendings', 'logs', 'categories', 'types', 'reports', 'settings']
export const ICON = { dash: '📊', trees: '🌳', spendings: '💰', logs: '📝', categories: '🗂️', types: '🏷️', reports: '📈', settings: '⚙️' }
export const money = v => '$' + Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })
export const num = v => (v == null || v === '' ? '' : Math.round(v * 100) / 100)
export const BADGE = { fertilizer: 'bg-sky-100 text-sky-700', sick: 'bg-red-100 text-red-700', flower: 'bg-pink-100 text-pink-700', fruit: 'bg-amber-100 text-amber-700' }
// field: [key, type, source, labelField, showOnKinds]
export const E = {
  trees: [['code', 'text'], ['note', 'text']],
  categories: [['name', 'text']],
  types: [['category_id', 'sel', 'categories'], ['name', 'text']],
  spendings: [['date', 'date'], ['category_id', 'sel', 'categories'], ['type_id', 'sel', 'types'], ['tree_id', 'sel', 'trees', 'code'], ['kg', 'number'], ['price_per_kg', 'number'], ['amount', 'number'], ['note', 'text']],
  logs: [['date', 'date'], ['tree_id', 'sel', 'trees', 'code'], ['kind', 'kind'], ['sickness', 'text', , , ['sick']], ['medicine', 'text', , , ['sick']], ['fruit_count', 'number', , , ['fruit']], ['weight_kg', 'number', , , ['fruit']], ['note', 'text']],
}
