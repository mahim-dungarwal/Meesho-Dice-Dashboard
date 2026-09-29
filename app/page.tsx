'use client'

import { useMemo, useState } from 'react'

const funnel = [
  { label: 'Identified', count: 128, color: '#7452d6', detail: 'Pipeline entries' },
  { label: 'Agreed', count: 104, color: '#8a69df', detail: 'Exploring MEERA' },
  { label: 'Eligible', count: 86, color: '#a080e7', detail: 'Passed checks' },
  { label: 'Launched', count: 72, color: '#b695ec', detail: 'Selling enabled' },
  { label: 'First delivery', count: 58, color: '#c9a9f1', detail: 'Successful delivery' },
  { label: 'Growing', count: 43, color: '#ddc6f5', detail: 'Order milestone' },
  { label: 'Graduated', count: 31, color: '#ecdff8', detail: 'Support ended' },
  { label: 'Retained', count: 24, color: '#f0a43c', detail: 'Still selling' },
]

const weeks = [
  { label: 'Jun 2', orders: 118, nmv: 5.2 }, { label: 'Jun 9', orders: 142, nmv: 6.4 },
  { label: 'Jun 16', orders: 158, nmv: 7.1 }, { label: 'Jun 23', orders: 176, nmv: 8.5 },
  { label: 'Jun 30', orders: 191, nmv: 9.1 }, { label: 'Jul 7', orders: 214, nmv: 10.8 },
  { label: 'Jul 14', orders: 231, nmv: 11.4 }, { label: 'Jul 21', orders: 247, nmv: 12.9 },
]

const cohortRows = [
  { cohort: 'Jan 2026', sellers: 18, self: '11 / 12', assisted: '4 / 5', overall: '16 / 18', immature: false },
  { cohort: 'Feb 2026', sellers: 22, self: '13 / 16', assisted: '4 / 4', overall: '17 / 22', immature: false },
  { cohort: 'Mar 2026', sellers: 27, self: '—', assisted: '—', overall: 'Not yet available', immature: true },
  { cohort: 'Apr 2026', sellers: 31, self: '—', assisted: '—', overall: 'Not yet available', immature: true },
]

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    funnel: 'M3 4h18l-7 8v6l-4 2v-8L3 4z',
    users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75',
    chart: 'M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-7M20 16v-11',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.4 1.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2v-.5a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.4-1.4.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.04H7v-2h.84A1.7 1.7 0 0 0 9.4 10.9a1.7 1.7 0 0 0-.34-1.88L9 8.96l1.4-1.4.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.4 6.4V6h2v.4a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.4 1.4-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04H21v2h-.56A1.7 1.7 0 0 0 19.4 15z',
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon"><path d={paths[name]} /></svg>
}

const metricDefinitions: Record<string, string> = {
  '90-day post-assistance churn': 'Share of eligible manufacturers that stopped selling within 90 days after scheduled support ended. Retention is anchored to the support-end date.',
  'At risk during assistance': 'Manufacturers with no successful order in the current inactivity window while assistance is still active.',
  'Active manufacturers': 'Manufacturers with at least one successful, settled order in the trailing 30 days.',
  'Successfully delivered orders': 'Order lines with a completed delivery outcome, excluding cancelled, returned, and unsuccessful lines.',
  'Net merchandise value': 'Gross merchandise value from settled successful order lines, excluding shipping, taxes, and returns.',
  'RTO / unsuccessful orders': 'Share of order lines marked returned-to-origin or otherwise unsuccessful after the final outcome is recorded.',
}

function StatCard({ label, value, change, tone, foot, onInfo }: { label: string; value: string; change?: string; tone?: string; foot: string; onInfo: (label: string) => void }) {
  return <article className="stat-card">
    <div className="stat-label">{label}<button className="info" aria-label={`Definition of ${label}`} onClick={() => onInfo(label)}>i</button></div>
    <div className="stat-row"><strong className={tone}>{value}</strong>{change && <span className={tone === 'negative' ? 'delta down' : 'delta'}>{change}</span>}</div>
    <div className="stat-foot">{foot}</div>
  </article>
}

function LineChart() {
  const max = 260
  const points = weeks.map((w, i) => `${i * 13.5 + 3},${112 - (w.orders / max) * 88}`).join(' ')
  const nmvPoints = weeks.map((w, i) => `${i * 13.5 + 3},${112 - (w.nmv / 14) * 88}`).join(' ')
  return <div className="chart-wrap">
    <svg viewBox="0 0 102 124" preserveAspectRatio="none" role="img" aria-label="Successful orders and NMV trend">
      {[24, 52, 80, 108].map(y => <line key={y} x1="3" x2="99" y1={y} y2={y} className="grid-line" />)}
      <polyline points={nmvPoints} className="line-orange" />
      <polyline points={points} className="line-purple" />
      {weeks.map((w, i) => <circle key={w.label} cx={i * 13.5 + 3} cy={112 - (w.orders / max) * 88} r="1.7" className="dot-purple" />)}
    </svg>
    <div className="x-labels">{weeks.map(w => <span key={w.label}>{w.label}</span>)}</div>
  </div>
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [range, setRange] = useState('Last 90 days')
  const [segment, setSegment] = useState('All segments')
  const [cohort, setCohort] = useState('All cohorts')
  const [category, setCategory] = useState('All categories')
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [definition, setDefinition] = useState<string | null>(null)
  const rangeFactor = range === 'Last 180 days' ? 1.18 : range === 'Year to date' ? 0.86 : 1
  const segmentFactor = segment === 'Large manufacturer' ? 0.62 : segment === 'Emerging manufacturer' ? 0.38 : 1
  const cohortFactor = cohort === 'Q1 2026' ? 0.72 : cohort === 'Q2 2026' ? 0.58 : 1
  const categoryFactor = category === 'Home & living' ? 0.78 : category === 'Fashion' ? 1.12 : category === 'Beauty' ? 0.66 : 1
  const filterFactor = rangeFactor * segmentFactor * cohortFactor * categoryFactor
  const dynamicActive = Math.round(67 * filterFactor)
  const dynamicOrders = Math.round(1476 * filterFactor)
  const dynamicNmv = (68.4 * filterFactor).toFixed(1)
  const dynamicChurn = (18.4 / Math.max(segmentFactor, 0.38) * (1 + (1 - cohortFactor) * 0.15)).toFixed(1)
  const dynamicRisk = Math.max(1, Math.round(14 * segmentFactor * cohortFactor))
  const dynamicRto = (11.8 / rangeFactor * (1 + (1 - categoryFactor) * 0.08)).toFixed(1)
  const dynamicFunnel = funnel.map(stage => ({ ...stage, count: Math.max(1, Math.round(stage.count * filterFactor)) }))
  const resetFilters = () => { setRange('Last 90 days'); setSegment('All segments'); setCohort('All cohorts'); setCategory('All categories') }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">m</div><div><div className="brand-name">MEERA</div><div className="brand-sub">BUSINESS DASHBOARD</div></div></div>
      <div className="demo-pill"><span /> DEMO DATA</div>
      <nav className="nav" aria-label="Main navigation">
        {['Overview', 'Funnel details', 'Retention & graduation', 'Sales & orders'].map((item, i) => <button className={active === item ? 'nav-item active' : 'nav-item'} key={item} onClick={() => setActive(item)}><Icon name={['grid', 'funnel', 'users', 'chart'][i]} /><span>{item}</span>{item === 'Overview' && <b>1</b>}</button>)}
      </nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setShowConfig(!showConfig)}><Icon name="settings" /><span>Metric configuration</span></button><div className="workspace"><div className="avatar">MB</div><div><strong>Meera Business</strong><small>Programme team</small></div><span className="chevron">⌄</span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="crumb">MEERA / <span>{active.toUpperCase()}</span></div><div className="top-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="icon-button" aria-label="Notifications">◌</button><div className="top-avatar">MB</div></div></header>
      <div className="page-heading"><div><div className="eyebrow">PILOT PERFORMANCE</div><h1>{active}</h1><p>Is MEERA helping manufacturers start, sell, and stay active?</p></div><div className="heading-meta"><span className="updated"><i /> Updated today, 09:42 AM</span><button className="export-button" onClick={() => alert('CSV export prepared for the filtered dashboard view.')}>↓ <span>Export CSV</span></button></div></div>
      {showConfig && <div className="config-note"><strong>Configuration visible</strong> · Order milestone: not approved · Return window: configured by source · Unsuccessful reason priority: final status. Demo values are not production results.</div>}
      <div className="filters"><div className="filter-group"><label>Date range</label><select value={range} onChange={e => setRange(e.target.value)}><option>Last 90 days</option><option>Last 180 days</option><option>Year to date</option></select></div><div className="filter-group"><label>Identification cohort</label><select value={cohort} onChange={e => setCohort(e.target.value)}><option>All cohorts</option><option>Q1 2026</option><option>Q2 2026</option></select></div><div className="filter-group"><label>Segment</label><select value={segment} onChange={e => setSegment(e.target.value)}><option>All segments</option><option>Large manufacturer</option><option>Emerging manufacturer</option></select></div><div className="filter-group"><label>Category</label><select value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option><option>Home & living</option><option>Fashion</option><option>Beauty</option></select></div><button className="clear-filter" onClick={resetFilters}>Reset filters</button></div>
      <div className="anchor-bar"><span className="anchor-dot purple" /> Funnel anchored to <strong>identification date</strong><span className="anchor-sep" /> <span className="anchor-dot orange" /> Retention anchored to <strong>scheduled support end</strong><span className="anchor-sep" /> <span className="anchor-dot green" /> Sales anchored to <strong>settled order outcome</strong></div>
      <section className="stats-grid"><StatCard onInfo={setDefinition} label="90-day post-assistance churn" value={`${dynamicChurn}%`} change="↓ 3.2 pp" tone="positive" foot="7 / 38 eligible manufacturers" /><StatCard onInfo={setDefinition} label="At risk during assistance" value={`${dynamicRisk}`} change="↑ 2" tone="negative" foot="9 inactive 30–59d · 5 inactive 60d+" /><StatCard onInfo={setDefinition} label="Active manufacturers" value={`${dynamicActive}`} change="↑ 8.1%" foot="Trailing 30-day successful order" /><StatCard onInfo={setDefinition} label="Successfully delivered orders" value={`${dynamicOrders.toLocaleString()}`} change="↑ 12.6%" foot="Mature settled order cohort" /><StatCard onInfo={setDefinition} label="Net merchandise value" value={`INR ${dynamicNmv}L`} change="↑ 9.8%" foot="Excl. shipping, taxes & returns" /><StatCard onInfo={setDefinition} label="RTO / unsuccessful orders" value={`${dynamicRto}%`} change="↓ 1.4 pp" tone="positive" foot="189 / 1,604 order lines" /></section>
      <div className="content-grid">
        <section className="panel funnel-panel"><div className="panel-head"><div><h2>Manufacturer journey</h2><p>Identification cohort · {range}</p></div><button className="more-button">•••</button></div><div className="funnel-list">{dynamicFunnel.map((stage, i) => <button key={stage.label} className={selectedStage === stage.label ? 'funnel-row selected' : 'funnel-row'} onClick={() => setSelectedStage(stage.label)}><span className="stage-num">{String(i + 1).padStart(2, '0')}</span><span className="stage-info"><strong>{stage.label}</strong><small>{stage.detail}</small></span><span className="funnel-track"><span style={{ width: `${(stage.count / dynamicFunnel[0].count) * 100}%`, background: stage.color }} /></span><span className="stage-count">{stage.count}</span><span className="stage-rate">{i === 0 ? '100%' : `${Math.round((stage.count / dynamicFunnel[0].count) * 100)}%`}</span></button>)}</div><div className="branch"><span>Graduate path</span><div><b className="branch-self" /> Self-service <strong>19</strong></div><div><b className="branch-assisted" /> Continued assisted <strong>8</strong></div><div><b className="branch-exited" /> Exited / undecided <strong>4</strong></div></div><div className="panel-foot">Click any stage to see supporting manufacturers <span>↗</span></div></section>
        <section className="panel trend-panel"><div className="panel-head"><div><h2>Sales momentum</h2><p>Settled outcome cohort · weekly trend</p></div><div className="legend"><span><i className="legend-purple" /> Delivered orders</span><span><i className="legend-orange" /> NMV</span></div></div><div className="trend-summary"><div><small>Successful orders</small><strong>1,476</strong><span className="positive">+12.6%</span></div><div><small>Net merchandise value</small><strong>INR 68.4L</strong><span className="positive">+9.8%</span></div><div><small>Average order value</small><strong>₹ 463</strong><span className="muted">per delivered line</span></div></div><LineChart /><div className="chart-axis-note">Orders and NMV use the same settled manufacturer order-line cohort.</div></section>
      </div>
      <div className="lower-grid"><section className="panel"><div className="panel-head"><div><h2>Post-assistance retention</h2><p>Scheduled support-end cohort · point-in-time block outcomes</p></div><button className="view-link" onClick={() => setActive('Retention & graduation')}>View details ↗</button></div><div className="table-wrap"><table><thead><tr><th>COHORT</th><th>SELLERS</th><th>30 DAYS</th><th>60 DAYS</th><th>90 DAYS</th></tr></thead><tbody>{cohortRows.map(r => <tr key={r.cohort}><td><strong>{r.cohort}</strong></td><td>{r.sellers}</td><td><span className="retained-cell">{r.self}</span></td><td><span className="retained-cell">{r.assisted}</span></td><td className={r.immature ? 'immature' : 'retained-cell'}>{r.overall}</td></tr>)}</tbody></table></div><div className="table-note"><span className="status-dot" /> Mature cell: retained / eligible base <span className="status-dot gray" /> Immature cohort: outcome window not elapsed</div></section><section className="panel dropoff-panel"><div className="panel-head"><div><h2>Largest drop-offs</h2><p>Recorded reasons from current funnel</p></div><button className="view-link" onClick={() => setActive('Funnel details')}>View all ↗</button></div><div className="drop-list"><div><span className="drop-number">01</span><div><strong>Eligibility → Launch</strong><small>14 manufacturers · listing or enablement barrier</small></div><b>−16.3%</b></div><div><span className="drop-number">02</span><div><strong>Launched → First delivery</strong><small>14 manufacturers · no order in follow-up window</small></div><b>−19.4%</b></div><div><span className="drop-number">03</span><div><strong>Graduated → Retained</strong><small>7 manufacturers · inactive after support end</small></div><b>−22.6%</b></div></div><div className="panel-foot">Reasons are based on recorded status events <span>ⓘ</span></div></section></div>
      <footer className="page-footer"><span><b>DEMO DATASET</b> · Synthetic values for interface review only. No production pilot results.</span><span>Metric definitions <a href="#definitions">↗</a> · Data dictionary <a href="#dictionary">↗</a></span></footer>
      {selectedStage && <div className="stage-toast"><strong>{selectedStage}</strong> selected <button onClick={() => setSelectedStage(null)}>×</button></div>}
      {definition && <div className="definition-popover" role="dialog" aria-label={`${definition} definition`}><div className="definition-head"><strong>{definition}</strong><button aria-label="Close definition" onClick={() => setDefinition(null)}>×</button></div><p>{metricDefinitions[definition]}</p><small>Definition from the MEERA metric dictionary.</small></div>}
    </main>
  </div>
}
