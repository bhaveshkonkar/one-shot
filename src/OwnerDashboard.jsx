import React, { useEffect, useMemo, useState } from 'react'
import { supabase, missingSupabaseEnv } from './lib/supabaseClient'

const brandSerif = { fontFamily: "'Cormorant Garamond', serif" }
const brandSans = { fontFamily: "'Jost', sans-serif" }

const statusTone = {
  Pending: 'bg-[#f6e9d6] text-[#8c6a2f]',
  Completed: 'bg-[#dfeae2] text-[#2f5c3f]',
  Cancelled: 'bg-[#f4ddde] text-[#8b3d3f]',
}

const paymentTone = {
  Paid: 'text-[#2f5c3f]',
  'Not Paid': 'text-[#8c6a2f]',
}

const makeId = () => (crypto?.randomUUID ? crypto.randomUUID() : `oid-${Date.now()}-${Math.random().toString(16).slice(2)}`)

const initialOrders = []

const cardHover = 'transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-24px_rgba(26,21,17,0.35)]'

const toDateKey = (dateStr) => {
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return null
  const y = parsed.getFullYear()
  const m = String(parsed.getMonth() + 1).padStart(2, '0')
  const d = String(parsed.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const toDateKeyFromDate = (dateObj) => {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const heatmapColors = ['#f4f1ea', '#e4dccc', '#d6c8b2', '#c5b398', '#b29c7e']

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a8a7e]" style={brandSans}>{eyebrow}</span>
        <h3 className="text-xl text-[#1a1a18] sm:text-2xl" style={brandSerif}>{title}</h3>
      </div>
    </div>
  )
}

function Badge({ tone, children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-[11px] ${tone}`} style={brandSans}>
      {children}
    </span>
  )
}

function OrderCard({ row, onUpdate }) {
  return (
    <div className="rounded-lg border border-[#e4ddd1] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-[#1a1a18]" style={brandSerif}>{row.client}</p>
          <p className="mt-0.5 text-xs text-[#6f695f]" style={brandSans}>{row.type} · {row.date}</p>
          <p className="text-xs text-[#8a8a7e]" style={brandSans}>{row.location}</p>
          {row.phone && (
            <p className="text-xs text-[#6f695f]" style={brandSans}>Phone: {row.phone}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onUpdate(row)}
          className="shrink-0 rounded-full bg-[#1c1511] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white transition duration-200 hover:opacity-90"
          style={brandSans}
        >
          Update
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={row.accepted ? 'bg-[#dfeae2] text-[#2f5c3f]' : 'bg-[#f6e9d6] text-[#8c6a2f]'}>
          {row.accepted ? 'Accepted' : 'Awaiting'}
        </Badge>
        <Badge tone={statusTone[row.status]}>{row.status}</Badge>
        <span className={`text-xs font-medium ${paymentTone[row.payment] || ''}`} style={brandSans}>{row.payment}</span>
        {row.source === 'form' && !row.contacted && (
          <Badge tone="bg-[#f4ddde] text-[#8b3d3f]">Contact?</Badge>
        )}
        {row.amount > 0 && (
          <span className="ml-auto text-xs font-medium text-[#1a1a18]" style={brandSans}>
            ₹{row.amount.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </div>
  )
}

export default function OwnerDashboard() {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [formState, setFormState] = useState({ accepted: false, status: 'Pending', payment: 'Not Paid', amount: '', contacted: true })
  const [navOpen, setNavOpen] = useState(false)
  const [selectedDayKey, setSelectedDayKey] = useState(null)
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [creating, setCreating] = useState(false)
  const [newOrder, setNewOrder] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sessionType: '',
    date: '',
    location: '',
    details: '',
    expectations: '',
    accepted: false,
    status: 'Pending',
    payment: 'Not Paid',
    amount: '',
    source: 'manual',
    contacted: true,
  })
  const [newOrderError, setNewOrderError] = useState('')

  const stats = useMemo(() => {
    const total = orders.length
    const weekly = total
    const monthly = total
    const yearly = total
    const completed = orders.filter((o) => o.status === 'Completed').length
    const pending = orders.filter((o) => o.status === 'Pending').length
    const revenue = orders
      .filter((o) => o.payment === 'Paid')
      .reduce((sum, o) => sum + (Number.isFinite(o.amount) ? o.amount : 0), 0)
    return { total, weekly, monthly, yearly, completed, pending, revenue }
  }, [orders])

  const ordersByDay = useMemo(() => {
    return orders.reduce((acc, order) => {
      const key = toDateKey(order.date)
      if (!key) return acc
      acc[key] = acc[key] ? [...acc[key], order] : [order]
      return acc
    }, {})
  }, [orders])

  const heatmap = useMemo(() => {
    const start = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1)
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
    const startWeekday = start.getDay()
    const totalCells = startWeekday + daysInMonth <= 35 ? 35 : 42
    const cells = []
    for (let i = 0; i < totalCells; i += 1) {
      const dayNum = i - startWeekday + 1
      if (dayNum < 1 || dayNum > daysInMonth) {
        cells.push({ key: `blank-${i}`, inMonth: false, count: 0 })
        continue
      }
      const d = new Date(start.getFullYear(), start.getMonth(), dayNum)
      const key = toDateKeyFromDate(d)
      const count = ordersByDay[key]?.length || 0
      const color = heatmapColors[Math.min(count, heatmapColors.length - 1)]
      cells.push({ key, date: d, dayNum, count, color, inMonth: true })
    }
    const label = start.toLocaleString('default', { month: 'long', year: 'numeric' })
    return { cells, label }
  }, [monthCursor, ordersByDay])

  const selectedDayOrders = useMemo(() => {
    if (!selectedDayKey) return []
    return ordersByDay[selectedDayKey] || []
  }, [ordersByDay, selectedDayKey])
  const openEditor = (order) => {
    setSelectedOrder(order)
    setFormState({
      accepted: order.accepted,
      status: order.status,
      payment: order.payment,
      amount: order.amount > 0 ? String(order.amount) : '',
      contacted: order.source === 'form' ? !!order.contacted : true,
    })
  }

  const closeEditor = () => setSelectedOrder(null)

  const resetNewOrder = () => setNewOrder({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sessionType: '',
    date: '',
    location: '',
    details: '',
    expectations: '',
    accepted: false,
    status: 'Pending',
    payment: 'Not Paid',
    amount: '',
    source: 'manual',
    contacted: true,
  })

  const addOrder = async () => {
    if (!newOrder.firstName || !newOrder.lastName || !newOrder.email || !newOrder.phone || !newOrder.sessionType || !newOrder.date || !newOrder.location) {
      setNewOrderError('Fill all required fields marked with * before saving.')
      return
    }

    setNewOrderError('')

    if (missingSupabaseEnv) {
      window.alert('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    const parsedAmount = parseInt(newOrder.amount, 10) || 0
    const payload = {
      client: `${newOrder.firstName} ${newOrder.lastName}`.trim(),
      first_name: newOrder.firstName,
      last_name: newOrder.lastName,
      email: newOrder.email,
      phone: newOrder.phone || null,
      type: newOrder.sessionType,
      session_type: newOrder.sessionType,
      location: newOrder.location,
      shoot_date: newOrder.date,
      details: newOrder.details || null,
      expectations: newOrder.expectations || null,
      accepted: newOrder.accepted,
      status: newOrder.status,
      payment: newOrder.payment,
      amount: parsedAmount,
      source: 'manual',
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert failed', error)
      window.alert(`Could not save order: ${error.message || 'Check Supabase permissions/columns.'}`)
      return
    }

    const saved = data
      ? {
          id: data.id,
          client: data.client,
          phone: data.phone || '',
          type: data.type,
          date: data.shoot_date || data.created_at || '',
          location: data.location,
          accepted: !!data.accepted,
          status: data.status,
          payment: data.payment,
          amount: data.amount ?? 0,
          source: 'manual',
          contacted: true,
        }
      : null

    if (saved) {
      setOrders((prev) => [saved, ...prev])
    }

    resetNewOrder()
    setCreating(false)
  }

  useEffect(() => {
    const loadOrders = async () => {
      if (missingSupabaseEnv) return

      const [contactResp, ordersResp] = await Promise.all([
        supabase.from('contact_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ])

      const formOrders = (contactResp.data || []).map((row) => ({
        id: row.id,
        client: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        phone: row.phone || '',
        type: row.session_type || 'Booking Request',
        date: row.shoot_date || row.created_at || '',
        location: row.location || '—',
        accepted: false,
        status: 'Pending',
        payment: 'Not Paid',
        amount: 0,
        source: 'form',
        contacted: false,
      }))

      const manualOrders = (ordersResp.data || []).map((row) => ({
        id: row.id,
        client: row.client,
        phone: row.phone || '',
        type: row.type,
        date: row.shoot_date || row.created_at || '',
        location: row.location,
        accepted: !!row.accepted,
        status: row.status,
        payment: row.payment,
        amount: row.amount ?? 0,
        source: row.source || 'manual',
        contacted: true,
      }))

      setOrders([...formOrders, ...manualOrders])
    }

    loadOrders()
  }, [])

  const saveOrder = () => {
    if (!selectedOrder) return
    setOrders((prev) => prev.map((o) =>
      o.id === selectedOrder.id
        ? {
            ...o,
            accepted: formState.accepted,
            status: formState.status,
            payment: formState.payment,
            amount: parseInt(formState.amount, 10) || 0,
            contacted: o.source === 'form' ? formState.contacted : o.contacted,
          }
        : o
    ))
    closeEditor()
  }

  const deleteOrder = async (order) => {
    const confirmation = window.prompt('Type "confirm" to delete this order.')
    if (!confirmation || confirmation.trim().toLowerCase() !== 'confirm') return

    // If Supabase is not configured or the row has no id yet, just drop locally.
    if (missingSupabaseEnv || !order.id) {
      setOrders((prev) => prev.filter((o) => o.id !== order.id))
      return
    }

    const table = order.source === 'form' ? 'contact_requests' : 'orders'
    const { error } = await supabase.from(table).delete().eq('id', order.id)

    if (error) {
      console.error('Delete failed', error)
      window.alert('Could not delete. Check Supabase RLS permissions for deletes.')
      return
    }

    setOrders((prev) => prev.filter((o) => o.id !== order.id))
  }

  return (
    <div className="min-h-screen bg-[#ebeae6] text-[#1a1a18]">
      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">

        {/* ── Sidebar / Top-nav ── */}
        <aside className="sticky top-0 z-20 w-full border-b border-[#d9d4ca] bg-[#e7e2d9] shadow-sm shadow-black/5 backdrop-blur lg:static lg:h-screen lg:w-[240px] lg:shrink-0 lg:border-b-0 lg:border-r">

          {/* Mobile header row */}
          <div className="flex items-center justify-between px-4 py-3 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1c1511] text-sm text-white" style={brandSerif}>OS</div>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a8a7e]" style={brandSans}>Owner</p>
                <p className="text-sm font-medium" style={brandSerif}>Omkar Waingankar</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition hover:bg-white/50"
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-5 bg-[#1c1511] transition-transform duration-200 ${navOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[#1c1511] transition-opacity duration-200 ${navOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[#1c1511] transition-transform duration-200 ${navOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>

          {/* Mobile dropdown nav */}
          {navOpen && (
            <nav className="border-t border-[#d9d4ca] px-4 pb-3 pt-2 lg:hidden">
              {['Dashboard', 'Orders'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNavOpen(false)}
                  className="block w-full rounded-full px-4 py-2 text-left text-[12px] font-medium uppercase tracking-[0.18em] text-[#6f695f] transition duration-200 hover:bg-white/60 hover:text-[#1c1511]"
                  style={brandSans}
                >
                  {item}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop sidebar */}
          <div className="hidden h-full flex-col px-6 py-10 lg:flex">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1c1511] text-white" style={brandSerif}>OS</div>
              <div className="leading-tight">
                <p className="text-xs uppercase tracking-[0.28em] text-[#8a8a7e]" style={brandSans}>Owner</p>
                <p className="text-sm font-medium" style={brandSerif}>Omkar Waingankar</p>
              </div>
            </div>
            <nav className="mt-8 flex w-full flex-col gap-3">
              {['Dashboard', 'Orders'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full rounded-full px-4 py-2 text-left text-[12px] font-medium uppercase tracking-[0.18em] text-[#6f695f] transition duration-200 hover:bg-white/60 hover:text-[#1c1511]"
                  style={brandSans}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 md:px-8 lg:px-12 lg:pt-10">

          {/* Header */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a8a7e]" style={brandSans}>Dashboard</p>
              <h1 className="text-3xl text-[#1a1a18] sm:text-4xl" style={brandSerif}>Orders Overview</h1>
            </div>
            <p className="text-sm text-[#6f695f]" style={brandSans}>Last synced · just now</p>
          </div>

          {/* Stats — 2 cols on mobile, 3 on sm+ */}
          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { label: 'Total Orders', value: stats.total },
              { label: 'Completed', value: stats.completed },
              { label: 'Pending', value: stats.pending },
              { label: 'Weekly Orders', value: stats.weekly },
              { label: 'Monthly Orders', value: stats.monthly },
              { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}` },
            ].map((card) => (
              <div
                key={card.label}
                className={`bg-[#f4f1ea] ${cardHover} rounded-md border border-white/40 px-3 py-3 shadow-sm shadow-black/5 sm:px-4 sm:py-4`}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a7e] sm:text-[11px] sm:tracking-[0.26em]" style={brandSans}>{card.label}</p>
                <h4 className="mt-1.5 text-xl text-[#1a1a18] sm:mt-2 sm:text-2xl" style={brandSerif}>{card.value}</h4>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <section className="mb-10 rounded-lg border border-[#e1dbd0] bg-[#f6f2ea] p-4 shadow-sm shadow-black/5 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <SectionTitle eyebrow="Schedule" title="Booking Heatmap" />
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#d9d1c6] bg-white px-2 py-1 text-sm text-[#3a3530]" style={brandSans}>
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => {
                    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                    setSelectedDayKey(null)
                  }}
                  className="rounded-full px-2 py-1 transition hover:bg-[#f2eee7]"
                >
                  ←
                </button>

                <select
                  value={monthCursor.getMonth()}
                  onChange={(e) => {
                    const m = parseInt(e.target.value, 10)
                    setMonthCursor((prev) => new Date(prev.getFullYear(), m, 1))
                    setSelectedDayKey(null)
                  }}
                  className="rounded-md border border-[#e4ddd1] bg-white px-2 py-1 text-[12px] uppercase tracking-[0.12em] text-[#3a3530] focus:border-[#1c1511] focus:outline-none"
                  style={brandSans}
                >
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <option key={idx} value={idx}>{new Date(0, idx).toLocaleString('default', { month: 'short' })}</option>
                  ))}
                </select>

                <select
                  value={monthCursor.getFullYear()}
                  onChange={(e) => {
                    const y = parseInt(e.target.value, 10)
                    setMonthCursor((prev) => new Date(y, prev.getMonth(), 1))
                    setSelectedDayKey(null)
                  }}
                  className="rounded-md border border-[#e4ddd1] bg-white px-2 py-1 text-[12px] uppercase tracking-[0.12em] text-[#3a3530] focus:border-[#1c1511] focus:outline-none"
                  style={brandSans}
                >
                  {Array.from({ length: 20 }).map((_, idx) => {
                    const baseYear = new Date().getFullYear()
                    const year = baseYear - 10 + idx
                    return <option key={year} value={year}>{year}</option>
                  })}
                </select>

                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => {
                    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                    setSelectedDayKey(null)
                  }}
                  className="rounded-full px-2 py-1 transition hover:bg-[#f2eee7]"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-7 gap-2 rounded-lg border border-[#e4ddd1] bg-white p-3" role="grid">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
                    <div key={d} className="text-center text-[11px] uppercase tracking-[0.12em] text-[#8a8a7e]" style={brandSans}>{d}</div>
                  ))}
                  {heatmap.cells.map((cell) => {
                    if (!cell.inMonth) {
                      return <div key={cell.key} className="h-11 rounded-md border border-dashed border-[#eee7da] bg-[#f9f6f0]" />
                    }
                    const isSelected = selectedDayKey === cell.key
                    return (
                      <button
                        key={cell.key}
                        type="button"
                        onClick={() => setSelectedDayKey(cell.key)}
                        className={`flex h-11 flex-col justify-between rounded-md border px-2 py-1 text-left transition ${isSelected ? 'border-[#1c1511] shadow-sm' : 'border-[#e8e0d3]'}`}
                        style={{ backgroundColor: cell.color }}
                        aria-label={`Bookings on ${cell.date?.toDateString()} (${cell.count})`}
                        role="gridcell"
                      >
                        <span className="text-[10px] text-[#6f695f]" style={brandSans}>{cell.dayNum}</span>
                        <span className="text-[11px] font-medium text-[#1a1a18]" style={brandSans}>{cell.count || ''}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6f695f]" style={brandSans}>
                     <span>Fewer bookings</span>
                  {heatmapColors.map((c, idx) => (
                    <span key={c} className="h-3 w-6 rounded-sm border border-[#dcd4c7]" style={{ backgroundColor: c }} aria-label={`Level ${idx}`} />
                  ))}
                  <span>More bookings</span>
                </div>
              </div>

              <div className="rounded-lg border border-[#e4ddd1] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a8a7e]" style={brandSans}>Selected Day</p>
                    <p className="text-lg text-[#1a1a18]" style={brandSerif}>
                      {selectedDayKey ? new Date(`${selectedDayKey}T00:00:00`).toDateString() : 'Tap a day to view orders'}
                    </p>
                  </div>
                  {selectedDayKey && (
                    <Badge tone="bg-[#f2eee7] text-[#3a3530]">{selectedDayOrders.length} orders</Badge>
                  )}
                </div>

                <div className="mt-4 flex max-h-72 flex-col gap-3 overflow-y-auto pr-1 scroll-thin">
                  {selectedDayOrders.length === 0 && (
                    <p className="text-sm text-[#6f695f]" style={brandSans}>No orders for this date.</p>
                  )}
                  {selectedDayOrders.map((order) => (
                    <div key={order.id || `${order.client}-${order.date}`} className={`rounded-md border border-[#e6dfd4] bg-[#f9f6f0] p-3 ${cardHover}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-base text-[#1a1a18]" style={brandSerif}>{order.client}</p>
                          <p className="text-[12px] text-[#6f695f]" style={brandSans}>{order.type} · {order.location}</p>
                          {order.phone && (
                            <p className="text-[12px] text-[#6f695f]" style={brandSans}>Phone: {order.phone}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge tone={order.accepted ? 'bg-[#dfeae2] text-[#2f5c3f]' : 'bg-[#f6e9d6] text-[#8c6a2f]'}>{order.accepted ? 'Accepted' : 'Awaiting'}</Badge>
                            <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                            <span className={`${paymentTone[order.payment] || ''} text-[12px] font-medium`} style={brandSans}>{order.payment}</span>
                            {order.source === 'form' && !order.contacted && (
                              <Badge tone="bg-[#f4ddde] text-[#8b3d3f]">Contact?</Badge>
                            )}
                            {order.amount > 0 && (
                              <span className="text-[11px] text-[#6f695f]" style={brandSans}>₹{order.amount.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openEditor(order)}
                          className="shrink-0 rounded-full bg-[#1c1511] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white transition duration-200 hover:opacity-90"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Orders section */}
          <section className="rounded-lg border border-[#e1dbd0] bg-[#f6f2ea] p-4 shadow-sm shadow-black/5 sm:p-5">
            <SectionTitle eyebrow="Orders" title="Manage Incoming Orders" />

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCreating((v) => !v)}
                className="rounded-full bg-[#1c1511] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white transition duration-200 hover:opacity-90"
                style={brandSans}
              >
                {creating ? 'Close' : 'Add Order'}
              </button>
            </div>

            {creating && (
              <div className="mb-5 rounded-md border border-[#e4ddd1] bg-white p-4 shadow-sm" style={brandSans}>
                {newOrderError && (
                  <div className="mb-3 rounded-md border border-[#e6c7c7] bg-[#fff5f5] px-3 py-2 text-[12px] text-[#8b3d3f]">
                    {newOrderError}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">First Name*</label>
                    <input
                      value={newOrder.firstName}
                      onChange={(e) => setNewOrder((s) => ({ ...s, firstName: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      placeholder="Bhavesh"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Last Name*</label>
                    <input
                      value={newOrder.lastName}
                      onChange={(e) => setNewOrder((s) => ({ ...s, lastName: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      placeholder="Konkar"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Email*</label>
                    <input
                      type="email"
                      value={newOrder.email}
                      onChange={(e) => setNewOrder((s) => ({ ...s, email: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      placeholder="client@example.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Phone*</label>
                    <input
                      value={newOrder.phone}
                      onChange={(e) => setNewOrder((s) => ({ ...s, phone: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      placeholder="+91 90000 00000"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Photo Session Type*</label>
                    <select
                      value={newOrder.sessionType}
                      onChange={(e) => setNewOrder((s) => ({ ...s, sessionType: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] bg-white px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                    >
                      <option value="" disabled>Select type</option>
                      <option>Wedding & Engagement</option>
                      <option>Family Portrait</option>
                      <option>Maternity & Newborn</option>
                      <option>Real Estate</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Photoshoot Date*</label>
                    <input
                      type="date"
                      value={newOrder.date}
                      onChange={(e) => setNewOrder((s) => ({ ...s, date: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Location*</label>
                    <input
                      value={newOrder.location}
                      onChange={(e) => setNewOrder((s) => ({ ...s, location: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      placeholder="Pune"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-3">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Tell us more about your photoshoot detail</label>
                    <textarea
                      rows={2}
                      value={newOrder.details}
                      onChange={(e) => setNewOrder((s) => ({ ...s, details: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      placeholder="Any notes or preferences"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-3">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Tell us what you expect from the photoshoot</label>
                    <textarea
                      rows={2}
                      value={newOrder.expectations}
                      onChange={(e) => setNewOrder((s) => ({ ...s, expectations: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      placeholder="Deliverables, style, timeline..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Status</label>
                    <select
                      value={newOrder.status}
                      onChange={(e) => setNewOrder((s) => ({ ...s, status: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] bg-white px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                    >
                      {['Pending', 'Completed', 'Cancelled'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Payment</label>
                    <select
                      value={newOrder.payment}
                      onChange={(e) => setNewOrder((s) => ({ ...s, payment: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] bg-white px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                    >
                      {['Paid', 'Not Paid'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]">Amount (₹)</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={newOrder.amount}
                      onChange={(e) => setNewOrder((s) => ({ ...s, amount: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] px-3 py-2 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="new-accepted"
                      type="checkbox"
                      checked={newOrder.accepted}
                      onChange={(e) => setNewOrder((s) => ({ ...s, accepted: e.target.checked }))}
                      className="h-4 w-4 rounded border-[#cfc7bb] text-[#1c1511] focus:ring-[#1c1511]"
                    />
                    <label htmlFor="new-accepted" className="text-[12px] text-[#3a3530]">Mark as accepted</label>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addOrder}
                    className="rounded-full bg-[#1c1511] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white transition duration-200 hover:opacity-90"
                  >
                    Save Order
                  </button>
                  <button
                    type="button"
                    onClick={() => { resetNewOrder(); setCreating(false) }}
                    className="rounded-full border border-[#cfc7bb] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#3a3530] transition duration-200 hover:bg-[#f4efe6]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Mobile + tablet: cards */}
            <div className="flex flex-col gap-3 lg:hidden">
              {orders.map((row) => (
                <div key={row.id || `${row.client}-${row.date}`} className="relative">
                  <OrderCard row={row} onUpdate={openEditor} />
                  <div className="mt-1 flex gap-2 px-1" style={brandSans}>
                    <button
                      type="button"
                      onClick={() => deleteOrder(row)}
                      className="rounded-full border border-[#cfc7bb] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#3a3530] transition duration-200 hover:bg-[#f4efe6]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop lg+: table */}
            <div className="hidden overflow-x-auto rounded-md border border-[#e4ddd1] bg-white lg:block">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[1.4fr_0.8fr_1fr_1fr_0.9fr_0.9fr_1.1fr] bg-[#f4f0e8] px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#8a8a7e]" style={brandSans}>
                  <span>Client</span>
                  <span>Type</span>
                  <span>Date</span>
                  <span>Location</span>
                  <span>Accepted</span>
                  <span>Status</span>
                  <span>Payment</span>
                </div>
                <div className="divide-y divide-[#f1ece3]">
                  {orders.map((row) => (
                    <div
                      key={row.id || `${row.client}-${row.date}`}
                      className="grid grid-cols-[1.4fr_0.8fr_1fr_1fr_0.9fr_0.9fr_1.1fr] items-center px-4 py-3 text-sm text-[#3a3530] transition duration-200 hover:bg-[#f9f6f0]"
                      style={brandSans}
                    >
                      <span className="truncate pr-2 font-medium">
                        {row.client}
                        {row.phone && (
                          <span className="block text-[11px] font-normal text-[#6f695f]">{row.phone}</span>
                        )}
                      </span>
                      <span>{row.type}</span>
                      <span className="truncate pr-2">{row.date}</span>
                      <span className="truncate pr-2">{row.location}</span>
                      <span>
                        <Badge tone={row.accepted ? 'bg-[#dfeae2] text-[#2f5c3f]' : 'bg-[#f6e9d6] text-[#8c6a2f]'}>
                          {row.accepted ? 'Accepted' : 'Awaiting'}
                        </Badge>
                      </span>
                      <span><Badge tone={statusTone[row.status]}>{row.status}</Badge></span>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className={`${paymentTone[row.payment] || ''}`}>{row.payment}</span>
                          {row.amount > 0 && (
                            <span className="text-[11px] text-[#6f695f]">₹{row.amount.toLocaleString('en-IN')}</span>
                          )}
                          {row.source === 'form' && !row.contacted && (
                            <span className="text-[11px] text-[#8b3d3f]">Needs contact</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openEditor(row)}
                          className="shrink-0 rounded-full bg-[#1c1511] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white transition duration-200 hover:opacity-90"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteOrder(row)}
                          className="shrink-0 rounded-full border border-[#cfc7bb] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#3a3530] transition duration-200 hover:bg-[#f4efe6]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ── Modal ── */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="absolute inset-0" onClick={closeEditor} />
            <div className="relative z-10 w-full rounded-t-2xl border border-[#e1dbd0] bg-[#f6f2ea] p-5 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.45)] sm:max-w-lg sm:rounded-xl sm:p-6">

              {/* Drag handle – mobile only */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#cfc7bb] sm:hidden" />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a8a7e]" style={brandSans}>Update Order</p>
                  <h3 className="text-2xl text-[#1a1a18]" style={brandSerif}>{selectedOrder.client}</h3>
                  <p className="truncate text-sm text-[#6f695f]" style={brandSans}>{selectedOrder.type} · {selectedOrder.date} · {selectedOrder.location}</p>
                  {selectedOrder.phone && (
                    <p className="text-sm text-[#6f695f]" style={brandSans}>Phone: {selectedOrder.phone}</p>
                  )}
                </div>
                <button onClick={closeEditor} className="shrink-0 text-2xl leading-none text-[#8a8a7e] transition hover:text-[#1c1511]" aria-label="Close">×</button>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <label className="flex items-center gap-3 text-sm text-[#3a3530]" style={brandSans}>
                  <input
                    type="checkbox"
                    checked={formState.accepted}
                    onChange={(e) => setFormState((s) => ({ ...s, accepted: e.target.checked }))}
                    className="h-4 w-4 rounded border-[#cfc7bb] text-[#1c1511] focus:ring-[#1c1511]"
                  />
                  Mark as accepted
                </label>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-[0.22em] text-[#8a8a7e]" style={brandSans}>Order Status</label>
                    <select
                      value={formState.status}
                      onChange={(e) => setFormState((s) => ({ ...s, status: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] bg-white px-3 py-2.5 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      style={brandSans}
                    >
                      {['Pending', 'Completed', 'Cancelled'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-[0.22em] text-[#8a8a7e]" style={brandSans}>Payment Status</label>
                    <select
                      value={formState.payment}
                      onChange={(e) => setFormState((s) => ({ ...s, payment: e.target.value }))}
                      className="rounded-md border border-[#dcd4c7] bg-white px-3 py-2.5 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                      style={brandSans}
                    >
                      {['Paid', 'Not Paid'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedOrder?.source === 'form' && (
                  <label className="flex items-center gap-3 text-sm text-[#3a3530]" style={brandSans}>
                    <input
                      type="checkbox"
                      checked={formState.contacted}
                      onChange={(e) => setFormState((s) => ({ ...s, contacted: e.target.checked }))}
                      className="h-4 w-4 rounded border-[#cfc7bb] text-[#1c1511] focus:ring-[#1c1511]"
                    />
                    Mark as contacted
                  </label>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-[0.22em] text-[#8a8a7e]" style={brandSans}>Amount (₹)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={formState.amount}
                    onChange={(e) => setFormState((s) => ({ ...s, amount: e.target.value }))}
                    placeholder="0"
                    className="rounded-md border border-[#dcd4c7] bg-white px-3 py-2.5 text-sm text-[#1a1a18] focus:border-[#1c1511] focus:outline-none"
                    style={brandSans}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-full border border-[#cfc7bb] px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-[#3a3530] transition duration-200 hover:bg-[#f4efe6]"
                  style={brandSans}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveOrder}
                  className="rounded-full bg-[#1c1511] px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-white transition duration-200 hover:opacity-90"
                  style={brandSans}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}