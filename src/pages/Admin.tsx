/** KasaBiz platform admin — visually distinct dark console with mock data. */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight, BarChart3, Building2, CreditCard, LayoutDashboard, LogOut,
  Settings, ShieldCheck, Store, TrendingUp, Users,
} from "lucide-react";
import { ADMIN } from "../data/mockData";
import { AreaMoney, BarsMoney, CHART, Donut, HBars } from "../components/charts";
import { Avatar, Badge, KenteBar } from "../components/ui";
import { cx, fmtDate, ghs } from "../lib/format";

const TABS = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { id: "users", label: "Users", icon: <Users className="size-4" /> },
  { id: "businesses", label: "Businesses", icon: <Store className="size-4" /> },
  { id: "subscriptions", label: "Subscriptions", icon: <CreditCard className="size-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="size-4" /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Admin() {
  const [tab, setTab] = useState<TabId>("overview");
  const t = ADMIN.totals;

  return (
    <div className="min-h-screen bg-navy2 text-white" data-theme="dark">
      <div className="lg:grid lg:grid-cols-[220px_1fr]">
        {/* admin sidebar */}
        <aside className="hidden lg:flex flex-col border-r border-white/8 bg-navy2 sticky top-0 h-screen">
          <div className="h-16 flex items-center px-5 border-b border-white/8 gap-2.5">
            <span className="grid place-items-center size-8 rounded-lg bg-danger text-white"><ShieldCheck className="size-4" /></span>
            <div>
              <p className="font-display font-extrabold leading-none">KasaBiz</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-0.5">Admin Console</p>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {TABS.map((x) => (
              <button key={x.id} onClick={() => setTab(x.id)}
                className={cx("w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  tab === x.id ? "bg-white/10 text-white" : "text-white/55 hover:text-white hover:bg-white/5")}>
                <span className={tab === x.id ? "text-gold" : ""}>{x.icon}</span>{x.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/8">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition">
              <LogOut className="size-4" /> Exit admin demo
            </Link>
            <KenteBar className="mt-4 opacity-70" />
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 h-16 bg-navy2/90 backdrop-blur border-b border-white/8 flex items-center gap-3 px-4 sm:px-6">
            <span className="lg:hidden grid place-items-center size-8 rounded-lg bg-danger text-white"><ShieldCheck className="size-4" /></span>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight capitalize">{tab}</h1>
              <p className="text-[11px] text-white/45">Platform metrics · mock data</p>
            </div>
            <Link to="/" className="ml-auto lg:hidden text-xs font-bold text-white/70 hover:text-white">Exit</Link>
            <span className="hidden lg:inline-flex ml-auto items-center gap-2 text-xs font-bold text-white/60">
              <Avatar name="System Admin" size="sm" /> admin@kasabiz.app
            </span>
          </header>

          {/* mobile tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 border-b border-white/8">
            {TABS.map((x) => (
              <button key={x.id} onClick={() => setTab(x.id)}
                className={cx("chip shrink-0 !bg-transparent", tab === x.id ? "!bg-gold !text-navy !border-gold" : "!text-white/70 !border-white/15")}>
                {x.label}
              </button>
            ))}
          </div>

          <main className="p-4 sm:p-6 space-y-6">
            {tab === "overview" && (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                  <AdminStat label="Total Users" value={t.users.toLocaleString("en-GH")} icon={<Users className="size-4" />} delta="+184 this month" />
                  <AdminStat label="Total Businesses" value={t.businesses.toLocaleString("en-GH")} icon={<Store className="size-4" />} delta="+96 this month" />
                  <AdminStat label="Active Businesses" value={t.activeBusinesses.toLocaleString("en-GH")} icon={<TrendingUp className="size-4" />} delta="58% of total" />
                  <AdminStat label="Monthly Revenue" value={ghs(t.mrr)} icon={<CreditCard className="size-4" />} delta="+12.4% MoM" gold />
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  <DarkCard title="Registrations" sub="New users per month"><AreaMoney data={ADMIN.registrations} dataKey="users" name="Users" color={CHART.gold} height={230} /></DarkCard>
                  <DarkCard title="Revenue" sub="Subscription income (GH₵)"><BarsMoney data={ADMIN.revenue} dataKey="revenue" name="Revenue" color={CHART.brand} height={230} /></DarkCard>
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  <DarkCard title="Recent users" sub="Latest sign-ups across Ghana">
                    <DarkTable head={["Name", "Plan", "Region", "Joined"]}
                      rows={ADMIN.users.slice(0, 6).map((u) => [
                        <span key="n" className="flex items-center gap-2 font-semibold text-white"><Avatar name={u.name} size="sm" />{u.name}</span>,
                        <PlanBadge key="p" plan={u.plan} />,
                        <span key="r" className="text-white/60">{u.region}</span>,
                        <span key="d" className="text-white/60">{fmtDate(u.joined)}</span>,
                      ])} />
                  </DarkCard>
                  <DarkCard title="Recent businesses" sub="New shops onboarded">
                    <DarkTable head={["Business", "Type", "City", "Plan"]}
                      rows={ADMIN.businesses.slice(0, 6).map((b) => [
                        <span key="n" className="font-semibold text-white">{b.name}</span>,
                        <span key="t" className="text-white/60">{b.type}</span>,
                        <span key="c" className="text-white/60">{b.city}</span>,
                        <PlanBadge key="p" plan={b.plan} />,
                      ])} />
                  </DarkCard>
                </div>
              </>
            )}

            {tab === "users" && (
              <DarkCard title="All users" sub={`${t.users.toLocaleString("en-GH")} registered · showing latest`}>
                <DarkTable head={["Name", "Email", "Plan", "Region", "Status", "Joined"]} wide
                  rows={ADMIN.users.map((u) => [
                    <span key="n" className="flex items-center gap-2 font-semibold text-white"><Avatar name={u.name} size="sm" />{u.name}</span>,
                    <span key="e" className="text-white/60 font-mono text-xs">{u.email}</span>,
                    <PlanBadge key="p" plan={u.plan} />,
                    <span key="r" className="text-white/60">{u.region}</span>,
                    <span key="s"><Badge tone={u.status === "Active" ? "ok" : "neutral"} dot={u.status === "Active"}>{u.status}</Badge></span>,
                    <span key="d" className="text-white/60">{fmtDate(u.joined)}</span>,
                  ])} />
              </DarkCard>
            )}

            {tab === "businesses" && (
              <DarkCard title="All businesses" sub={`${t.businesses.toLocaleString("en-GH")} businesses on the platform`}>
                <DarkTable head={["Business", "Owner", "Type", "Region", "Plan", "Joined"]} wide
                  rows={ADMIN.businesses.map((b) => [
                    <span key="n" className="font-semibold text-white">{b.name}</span>,
                    <span key="o" className="text-white/60">{b.owner}</span>,
                    <span key="t" className="text-white/60">{b.type}</span>,
                    <span key="r" className="text-white/60">{b.region}</span>,
                    <PlanBadge key="p" plan={b.plan} />,
                    <span key="d" className="text-white/60">{fmtDate(b.joined)}</span>,
                  ])} />
              </DarkCard>
            )}

            {tab === "subscriptions" && (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                  <AdminStat label="Free Users" value={t.free.toLocaleString("en-GH")} icon={<Users className="size-4" />} delta="68% of base" />
                  <AdminStat label="Pro Users" value={t.pro.toLocaleString("en-GH")} icon={<TrendingUp className="size-4" />} delta={ghs(t.pro * 25) + "/mo"} gold />
                  <AdminStat label="Business Users" value={t.business.toLocaleString("en-GH")} icon={<Building2 className="size-4" />} delta={ghs(t.business * 50) + "/mo"} gold />
                  <AdminStat label="MRR" value={ghs(t.mrr)} icon={<CreditCard className="size-4" />} delta="+12.4% MoM" />
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  <DarkCard title="Plan distribution" sub="Free vs paid">
                    <Donut data={[
                      { name: "Free", value: t.free }, { name: "Pro", value: t.pro }, { name: "Business", value: t.business },
                    ]} height={230} money={false} innerLabel="accounts" />
                  </DarkCard>
                  <DarkCard title="Revenue trend" sub="Last 12 months (GH₵)"><BarsMoney data={ADMIN.revenue} dataKey="revenue" name="Revenue" color={CHART.gold} height={230} /></DarkCard>
                </div>
              </>
            )}

            {tab === "analytics" && (
                <div className="grid lg:grid-cols-2 gap-4">
                  <DarkCard title="Businesses by region" sub="Top regions"><HBars data={ADMIN.regions.map((r) => ({ name: r.name, value: r.count }))} height={300} color={CHART.brand} /></DarkCard>
                  <DarkCard title="Businesses by type" sub="What Ghana sells"><HBars data={ADMIN.types.map((r) => ({ name: r.name, value: r.count }))} height={300} color={CHART.ok} /></DarkCard>                <DarkCard title="Registrations" sub="12-month trend" className="lg:col-span-2"><AreaMoney data={ADMIN.registrations} dataKey="users" name="Users" color={CHART.gold} height={240} /></DarkCard>
              </div>
            )}

            {tab === "settings" && (
              <DarkCard title="Platform settings" sub="Demo controls">
                <div className="space-y-4 p-1">
                  {[
                    ["Maintenance mode", "Temporarily disable sign-ups"],
                    ["MoMo billing webhooks", "Listen for MTN / Telecel payment events"],
                    ["Weekly digest emails", "Send growth summaries to business owners"],
                  ].map(([l, d], i) => (
                    <div key={l} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/4 px-4 py-3.5">
                      <div><p className="text-sm font-bold">{l}</p><p className="text-xs text-white/50 mt-0.5">{d}</p></div>
                      <AdminToggle defaultOn={i === 1} />
                    </div>
                  ))}
                  <p className="text-xs text-white/40 flex items-center gap-2"><ArrowLeftRight className="size-3.5" /> These toggles are illustrative — no backend is connected in this demo.</p>
                </div>
              </DarkCard>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- admin pieces ------------------------------ */

function AdminStat({ label, value, icon, delta, gold }: {
  label: string; value: string; icon: React.ReactNode; delta: string; gold?: boolean;
}) {
  return (
    <div className={cx("rounded-xl border p-4 sm:p-5 transition-all hover:-translate-y-0.5", gold ? "bg-gold/10 border-gold/25" : "bg-white/4 border-white/8")}>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-wider text-white/45">{label}</span>
        <span className={cx("grid place-items-center size-8 rounded-lg", gold ? "bg-gold text-navy" : "bg-white/8 text-gold")}>{icon}</span>
      </div>
      <p className="font-display font-extrabold text-[22px] sm:text-2xl mt-2.5 tnum">{value}</p>
      <p className="text-[11px] font-semibold text-ok mt-1">{delta}</p>
    </div>
  );
}

function DarkCard({ title, sub, children, className }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-xl border border-white/8 bg-navy overflow-hidden", className)}>
      <div className="px-5 pt-4 pb-1">
        <h3 className="font-display font-bold text-[15px]">{title}</h3>
        {sub && <p className="text-xs text-white/45 mt-0.5">{sub}</p>}
      </div>
      <div className="pb-2">{children}</div>
    </div>
  );
}

function DarkTable({ head, rows, wide }: { head: string[]; rows: React.ReactNode[][]; wide?: boolean }) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className={cx("w-full text-[13px] border-collapse", wide && "min-w-[720px]")}>
        <thead>
          <tr>{head.map((h) => <th key={h} className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 px-5 py-2.5 border-b border-white/8 whitespace-nowrap">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-white/4 transition-colors">
              {r.map((c, j) => <td key={j} className="px-5 py-3 border-b border-white/5 whitespace-nowrap">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return <Badge tone={plan === "Business" ? "gold" : plan === "Pro" ? "brand" : "neutral"}>{plan}</Badge>;
}

function AdminToggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button role="switch" aria-checked={on} onClick={() => setOn(!on)}
      className={cx("relative w-11 h-6 rounded-full transition-colors", on ? "bg-ok" : "bg-white/15")}>
      <span className={cx("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}
