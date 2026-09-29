'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  Download,
  Filter,
  LayoutDashboard,
  ListFilter,
  MapPin,
  MoreHorizontal,
  PackageCheck,
  RefreshCw,
  Search,
  Settings2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'

const stages = [
  { label: 'Identified', short: 'Identify', count: 1284, color: '#6d28d9' },
  { label: 'Agreed to explore', short: 'Agree', count: 942, color: '#7c3aed' },
  { label: 'Eligibility checked', short: 'Eligibility', count: 711, color: '#8b5cf6' },
  { label: 'Launched', short: 'Launch', count: 548, color: '#a78bfa' },
  { label: 'First successful delivery', short: 'First delivery', count: 396, color: '#c084fc' },
  { label: 'Growing order volume', short: 'Grow', count: 247, color: '#d946ef' },
]

const manufacturers = [
  ['MFG-1048', 'Bharat Textiles', 'Grow', 'Self-service', 'Jaipur', '2 days ago', '—'],
  ['MFG-1092', 'Kaveri Homeware', 'Launch', 'Initial assistance', 'Moradabad', '18 days ago', 'Registration incomplete'],
  ['MFG-0981', 'Nisha Creations', 'Retain', 'Self-service', 'Surat', 'Yesterday', '—'],
  ['MFG-1134', 'Aarav Living', 'First delivery', 'Initial assistance', 'Panipat', '6 days ago', 'Awaiting delivery'],
  ['MFG-0874', 'Sundar Handloom', 'Graduate', 'Continued assisted', 'Varanasi', '12 days ago', '—'],
]

const cohorts = [
  { cohort: 'Jun 2026', sellers: 154, self: 62, assisted: 42, exited: 50, d30: '8.2%', d60: '12.8%', d90: '18.4%', mature: true },
  { cohort: 'Jul 2026', sellers: 181, self: 76, assisted: 51, exited: 54, d30: '6.9%', d60: '11.3%', d90: 'Not yet available', mature: false },
  { cohort: 'Aug 2026', sellers: 203, self: 84, assisted: 59, exited: 60, d30: '5.7%', d60: 'Not yet available', d90: 'Not yet available', mature: false },
  { cohort: 'Sep 2026', sellers: 221, self: 91, assisted: 63, exited: 67, d30: 'Not yet available', d60: 'Not yet available', d90: 'Not yet available', mature: false },
]

const trendBars = [48, 56, 52, 64, 62, 71, 68, 80, 76, 88, 84, 96]

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value)
}

function MetricCard({ label, value, note, change, tone = 'purple', definition }: { label: string; value: string; note: string; change?: string; tone?: 'purple' | 'orange' | 'green' | 'blue'; definition: string }) {
  return (
    <div className={`metric-card tone-${tone}`} title={definition}>
      <div className="metric-card-top"><span>{label}</span><CircleHelp size={15} /></div>
      <div className="metric-value">{value}</div>
      <div className="metric-footer"><span>{note}</span>{change && <span className={change.startsWith('-') ? 'change negative' : 'change'}>{change.startsWith('-') ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{change}</span>}</div>
    </div>
  )
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action}</div>
}

function Sparkline({ color = '#6d28d9' }: { color?: string }) {
  return <div className="sparkline" aria-hidden="true">{trendBars.map((height, i) => <span key={i} style={{ height: `${height}%`, background: color }} />)}</div>
}

export default function MeeraDashboard() {
  const [activePage, setActivePage] = useState('Overview')
  const [dateRange, setDateRange] = useState('Last 90 days')
  const [segment, setSegment] = useState('All segments')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStage, setSelectedStage] = useState('All manufacturers')
  const [search, setSearch] = useState('')

  const filteredManufacturers = useMemo(() => manufacturers.filter((row) => row.join(' ').toLowerCase().includes(search.toLowerCase())), [search])

  const renderOverview = () => <>
    <div className="hero-row"><div><p className="eyebrow">Pilot health · DEMO DATA</p><h1>MEERA business dashboard</h1><p className="subtitle">See how manufacturers move from identification to successful, retained selling.</p></div><div className="hero-actions"><button className="button secondary"><Download size={16} /> Export view</button><button className="button primary"><RefreshCw size={16} /> Refresh data</button></div></div>
    <div className="demo-banner"><Sparkles size={17} /><span><strong>DEMO DATASET</strong> — Sample values are illustrative and not actual pilot results.</span><button>View data notes <ArrowUpRight size={14} /></button></div>
    <div className="metric-grid">
      <MetricCard label="90-day post-assistance churn" value="18.4%" note="29 of 158 activated" change="-3.1 pp" definition="Formal exit or no successful order in days 61–90 after scheduled support end. Activation failures excluded." />
      <MetricCard label="At risk during assistance" value="74" note="41 in 30–59 days · 33 in 60+" change="+12.1%" tone="orange" definition="Activated manufacturers whose last successful order was 30–59 days or 60+ days ago." />
      <MetricCard label="Active manufacturers" value="318" note="Trailing 30 days" change="+8.6%" tone="green" definition="Activated manufacturers with at least one successful order in the trailing 30 days." />
      <MetricCard label="Successful delivered orders" value="8,462" note="Settled manufacturer order lines" change="+14.8%" tone="blue" definition="Delivered customer order lines, excluding subsequent returns in the configured return window." />
      <MetricCard label="Net merchandise value" value="₹18.6L" note="Excl. shipping & taxes" change="+11.4%" tone="purple" definition="Customer-paid merchandise value net of returns and refunds for the same settled order cohort." />
      <MetricCard label="RTO / unsuccessful orders" value="12.8%" note="1,260 of 9,844 mature lines" change="-1.8 pp" tone="orange" definition="Final unaccepted, rejected, not collected, or returned manufacturer order lines / mature order lines placed." />
    </div>
    <div className="content-grid funnel-layout"><section className="panel funnel-panel"><SectionHeading eyebrow="Identification cohort · last 90 days" title="Manufacturer journey" action={<button className="icon-button" title="Funnel definitions"><CircleHelp size={16} /></button>} /><div className="funnel"><div className="funnel-stages">{stages.map((stage, index) => <button className={`funnel-stage ${selectedStage === stage.label ? 'selected' : ''}`} key={stage.label} onClick={() => setSelectedStage(stage.label)} style={{ '--stage-color': stage.color, '--stage-width': `${100 - index * 10}%` } as React.CSSProperties}><span className="stage-bar" /><span className="stage-copy"><strong>{stage.label}</strong><small>{formatNumber(stage.count)} manufacturers</small></span><span className="stage-rate">{index === 0 ? '—' : `${Math.round((stage.count / stages[index - 1].count) * 100)}%`}</span></button>)}</div><div className="graduation"><div className="graduation-label"><span>Graduate</span><small>221 manufacturers · 100% of mature cohort</small></div><div className="graduation-options"><div><span className="legend-dot purple" /><strong>91</strong><small>Self-service <b>41%</b></small></div><div><span className="legend-dot pink" /><strong>63</strong><small>Continued assisted <b>29%</b></small></div><div><span className="legend-dot orange" /><strong>67</strong><small>Exited / undecided <b>30%</b></small></div></div></div><div className="retain-step"><span className="stage-bar" /><strong>Retain & grow</strong><span>158 active sellers</span><b>71%</b></div></div></section><section className="panel dropoff-panel"><SectionHeading eyebrow="Where momentum slows" title="Largest drop-offs" action={<button className="text-button">See all <ArrowUpRight size={14} /></button>} /><div className="dropoff-list"><div><span className="dropoff-rank">01</span><div><strong>Eligibility → Launch</strong><small>163 manufacturers · 22.9% drop-off</small></div><span className="reason-pill">Registration incomplete</span></div><div><span className="dropoff-rank">02</span><div><strong>Launch → First delivery</strong><small>152 manufacturers · 27.7% drop-off</small></div><span className="reason-pill">Low catalog readiness</span></div><div><span className="dropoff-rank">03</span><div><strong>First delivery → Grow</strong><small>149 manufacturers · 37.6% drop-off</small></div><span className="reason-pill">Order volume below target</span></div><div><span className="dropoff-rank">04</span><div><strong>Graduate → Retain</strong><small>63 manufacturers · 28.5% drop-off</small></div><span className="reason-pill warning">No order in days 61–90</span></div></div><div className="insight"><AlertTriangle size={16} /><span><strong>Priority signal:</strong> launch-to-delivery is the largest operational barrier in the current cohort.</span></div></section></div>
    <div className="content-grid bottom-grid"><section className="panel chart-panel"><SectionHeading eyebrow="Scheduled support-end cohort" title="Post-assistance outcomes" action={<div className="chart-legend"><span><i className="dot purple" />30 days</span><span><i className="dot orange" />60 days</span><span><i className="dot dark" />90 days</span></div>} /><div className="cohort-chart"><div className="chart-y"><span>25%</span><span>20%</span><span>15%</span><span>10%</span><span>5%</span><span>0%</span></div><div className="chart-plot"><div className="grid-lines" />{cohorts.map((cohort, i) => <div className="cohort-bar-group" key={cohort.cohort}><div className="bar-stack"><i style={{ height: cohort.mature ? '73%' : '34%', background: '#6d28d9' }} /><i style={{ height: cohort.mature ? '52%' : '20%', background: '#f97316' }} /><i style={{ height: cohort.mature ? '38%' : '0%', background: '#30205d' }} /></div><span>{cohort.cohort}</span></div>)}</div></div><p className="chart-note">Immature cohorts are shown as <strong>Not yet available</strong>, not 0%.</p></section><section className="panel chart-panel sales-chart"><SectionHeading eyebrow="Order placement → settled outcome" title="Delivered orders & NMV" action={<button className="icon-button"><MoreHorizontal size={17} /></button>} /><div className="sales-summary"><div><span>₹18.6L</span><small>NMV <b>+11.4%</b></small></div><div><span>8,462</span><small>Orders <b>+14.8%</b></small></div></div><Sparkline color="#d946ef" /><div className="sparkline-labels"><span>Jun 24</span><span>Sep 24</span></div></section></div>
  </>

  const renderDetail = () => <section className="detail-view"><div className="hero-row"><div><p className="eyebrow">{activePage} · supporting records</p><h1>{activePage === 'Funnel detail' ? 'Funnel detail' : activePage === 'Retention' ? 'Retention & graduation' : 'Sales & order outcomes'}</h1><p className="subtitle">Drill into the underlying manufacturers and order lines behind each metric.</p></div><button className="button secondary"><Download size={16} /> Export CSV</button></div>{activePage === 'Funnel detail' && <div className="detail-cards">{stages.map((stage, i) => <div className={`detail-stage ${selectedStage === stage.label ? 'selected' : ''}`} onClick={() => setSelectedStage(stage.label)} key={stage.label}><span style={{ background: stage.color }} /><small>0{i + 1} · {stage.short}</small><strong>{formatNumber(stage.count)}</strong><p>{i ? `${Math.round((stage.count / stages[i - 1].count) * 100)}% conversion` : '100% of cohort'}</p><span className="mini-progress"><i style={{ width: `${(stage.count / 1284) * 100}%`, background: stage.color }} /></span></div>)}</div>}{activePage === 'Retention' && <div className="panel table-panel"><SectionHeading eyebrow="Scheduled support-end cohort" title="Retention outcomes" action={<span className="table-note"><CircleHelp size={14} /> Immature cells are not yet available</span>} /><div className="retention-callout"><TrendingUp size={18} /><div><strong>North star: 90-day post-assistance churn</strong><span>29 of 158 activated manufacturers · 18.4% · activation failures excluded</span></div><b>-3.1 pp</b></div><div className="table-wrap"><table><thead><tr><th>Support-end cohort</th><th>Graduates</th><th>Self-service</th><th>Continued assisted</th><th>Exited / undecided</th><th>30-day churn</th><th>60-day churn</th><th>90-day churn</th></tr></thead><tbody>{cohorts.map((row) => <tr key={row.cohort}><td><strong>{row.cohort}</strong><small>{row.sellers} sellers</small></td><td>{row.sellers}</td><td>{row.self} <small>({Math.round(row.self / row.sellers * 100)}%)</small></td><td>{row.assisted} <small>({Math.round(row.assisted / row.sellers * 100)}%)</small></td><td>{row.exited} <small>({Math.round(row.exited / row.sellers * 100)}%)</small></td><td>{row.d30}</td><td>{row.d60}</td><td className={row.d90 === 'Not yet available' ? 'muted-cell' : ''}>{row.d90}</td></tr>)}</tbody></table></div></div>}{activePage === 'Sales & order outcomes' && <div className="sales-detail-grid"><div className="panel"><SectionHeading eyebrow="Mature order cohort" title="Unsuccessful order reasons" /><div className="reason-bars"><div><span>Returned</span><div><i style={{ width: '48%' }} /></div><b>604 · 48%</b></div><div><span>Not collected</span><div><i style={{ width: '27%' }} /></div><b>340 · 27%</b></div><div><span>Rejected</span><div><i style={{ width: '16%' }} /></div><b>202 · 16%</b></div><div><span>Unaccepted</span><div><i style={{ width: '9%' }} /></div><b>114 · 9%</b></div></div><p className="chart-note">Each manufacturer order line is counted once under its final unsuccessful reason.</p></div><div className="panel"><SectionHeading eyebrow="Trend" title="Successful delivered orders" /><div className="big-number">8,462 <span>+14.8%</span></div><Sparkline color="#22a06b" /><div className="sparkline-labels"><span>Jun 24</span><span>Sep 24</span></div></div></div>}</section>

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">M</div><div><strong>MEERA</strong><span>Business pilot</span></div></div><div className="demo-chip"><span /> Demo workspace</div><nav><p>WORKSPACE</p>{[['Overview', LayoutDashboard], ['Funnel detail', ListFilter], ['Retention', RefreshCw], ['Sales & order outcomes', ShoppingBag]].map(([label, Icon]) => <button className={activePage === label ? 'active' : ''} key={label as string} onClick={() => setActivePage(label as string)}><Icon size={18} />{label as string}{label === 'Overview' && <span className="nav-badge">6</span>}</button>)}</nav><div className="sidebar-bottom"><button><Settings2 size={18} /> Configuration</button><div className="user-chip"><div className="avatar">AS</div><div><strong>Arjun S.</strong><span>Programme lead</span></div><ChevronDown size={15} /></div></div></aside><main className="main-content"><header className="topbar"><div className="breadcrumbs"><span>MEERA pilot</span><b>/</b><strong>{activePage}</strong></div><div className="topbar-actions"><span className="updated"><span className="live-dot" />Data updated 2h ago</span><button className="icon-button"><CircleHelp size={18} /></button><div className="avatar small">AS</div></div></header><div className="page-content"><div className="toolbar"><div className="filter-row"><div className="select-wrap"><span>Date range</span><select value={dateRange} onChange={(e) => setDateRange(e.target.value)}><option>Last 90 days</option><option>Last 30 days</option><option>Year to date</option></select><ChevronDown size={15} /></div><div className="select-wrap"><span>Segment</span><select value={segment} onChange={(e) => setSegment(e.target.value)}><option>All segments</option><option>Home & living</option><option>Fashion</option><option>Beauty & care</option></select><ChevronDown size={15} /></div><button className={`filter-button ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /> More filters <span>3</span></button>{showFilters && <button className="clear-filter" onClick={() => setShowFilters(false)}><X size={14} /> Clear</button>}</div><div className="anchor-note"><MapPin size={14} /> {activePage === 'Sales & order outcomes' ? 'Sales anchored to settled order outcome' : activePage === 'Retention' ? 'Retention anchored to scheduled support end' : 'Funnel anchored to identification cohort'}</div></div>{activePage === 'Overview' ? renderOverview() : renderDetail()}</div></main><div className="sr-status" aria-live="polite">Showing {selectedStage}</div></div>
}
