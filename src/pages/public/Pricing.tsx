/** Detailed pricing page with plan comparison. */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, Minus, ArrowRight, Zap, Sparkles, X, MessageCircle, GitBranch } from "lucide-react";
import { Badge, Button, KenteBar, Modal } from "../../components/ui";
import { cx, ghs } from "../../lib/format";
import { useAnchorNav } from "../../components/layout/PublicLayout";
import { useApp } from "../../state/store";
import { authService } from "../../services/authService";

const TIERS = [
  {
    name: "Free", price: 0, yearly: 0, tag: "For getting started",
    blurb: "Everything you need to leave the notebook behind.",
    cta: "Start Free",
  },
  {
    name: "Pro", price: 25, yearly: 250, tag: "For busy shops", hot: true,
    blurb: "Full visibility — reports, reminders and room to grow.",
    cta: "Upgrade to Pro",
  },
  {
    name: "Business", price: 50, yearly: 500, tag: "For teams & branches",
    blurb: "Roles, branches and priority support for bigger operations.",
    cta: "Get Business",
  },
];

const ROWS: Array<{ label: string; values: [React.ReactNode, React.ReactNode, React.ReactNode] }> = [
  { label: "Businesses", values: ["1", "1", "Up to 3 branches"] },
  { label: "Products", values: ["50", "Unlimited", "Unlimited"] },
  { label: "Sales & digital receipts", values: [true, true, true] },
  { label: "Customer book & debtors", values: [true, true, true] },
  { label: "Expense tracking", values: [true, true, true] },
  { label: "Reports & charts", values: ["Basic", true, true] },
  { label: "CSV export", values: [false, true, true] },
  { label: "Debtor SMS reminders", values: [false, true, true] },
  { label: "Staff accounts", values: [false, "2", "Unlimited"] },
  { label: "Roles & permissions", values: [false, false, true] },
  { label: "Multi-branch stock", values: [false, false, true] },
  { label: "Priority support", values: [false, false, true] },
];

export default function Pricing() {
  const go = useAnchorNav();
  const nav = useNavigate();
  const { data, dispatch, toast } = useApp();
  const signedIn = !!authService.getSession();
  const [yearly, setYearly] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<typeof TIERS[number] | null>(null);
  const [aiOpen, setAiOpen] = React.useState(false);

  const continueWithTier = (tier: typeof TIERS[number]) => {
    if (!signedIn) {
      go("/register");
      return;
    }
    dispatch({ type: "PLAN_SET", plan: tier.name as "Free" | "Pro" | "Business" });
    toast(`${tier.name} plan activated for frontend testing.`, "success");
    setSelectedTier(null);
    nav("/settings", { state: { tab: "subscription" } });
  };

  return (
    <div className="relative py-16 lg:py-20 overflow-hidden">
      <div aria-hidden className="hero-orb hero-orb-gold" />
      <div aria-hidden className="hero-orb hero-orb-blue" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <Badge tone="brand" className="mb-4"><Zap className="size-3.5" /> Fair pricing in cedis</Badge>
          <h1 className="font-display font-extrabold text-4xl sm:text-[52px] leading-tight text-ink">
            Pick a plan, keep your profit
          </h1>
          <p className="text-sub text-lg mt-4">
            Pay monthly or yearly with MTN MoMo, Telecel Cash or AT Money. Cancel anytime — no penalties, no small print.
          </p>
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-line bg-card p-1">
            {(["Monthly", "Yearly (2 months free)"] as const).map((opt, i) => {
              const on = (i === 1) === yearly;
              return (
                <button key={opt} onClick={() => setYearly(i === 1)}
                  className={cx("px-4 py-2 rounded-full text-sm font-bold transition", on ? "bg-navy text-white shadow-sm" : "text-sub hover:text-ink")}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 max-w-5xl mx-auto grid sm:grid-cols-2 gap-4">
          {[
            { title: "Starter path", text: "Begin with Free, then move to Pro when your product list and daily sales outgrow the basics.", tone: "bg-brand-soft border-brand/10" },
            { title: "Growth path", text: "Choose Business when you add staff, roles or branches and need everyone working from the same numbers.", tone: "bg-gold-soft border-gold/20" },
          ].map((path) => (
            <div key={path.title} className={cx("rounded-xl border p-4 text-left", path.tone)}>
              <p className="font-display font-bold text-ink">{path.title}</p>
              <p className="text-xs text-sub mt-1 leading-relaxed">{path.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {TIERS.map((t, i) => {
            const price = yearly ? t.yearly : t.price;
            return (
              <div key={t.name} className={cx(
                "relative rounded-2xl border p-8 flex flex-col animate-fade-up",
                t.hot ? "bg-navy text-white border-navy shadow-pop lg:-my-5 lg:py-[52px]" : "bg-card border-line hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
              )} style={{ animationDelay: `${i * 90}ms` }}>
                {t.hot && (
                  <>
                    <KenteBar className="absolute top-0 inset-x-0 rounded-t-2xl" />
                    <Badge tone="gold" className="absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-card">Most popular</Badge>
                  </>
                )}
                <p className={cx("text-sm font-bold uppercase tracking-wider", t.hot ? "text-gold" : "text-brand")}>{t.tag}</p>
                <h2 className={cx("font-display font-extrabold text-2xl mt-1", t.hot ? "text-white" : "text-ink")}>{t.name}</h2>
                <p className={cx("text-sm mt-1", t.hot ? "text-white/60" : "text-sub")}>{t.blurb}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className={cx("font-display font-extrabold text-5xl tnum", t.hot ? "text-gold" : "text-ink")}>{ghs(price)}</span>
                  <span className={cx("text-sm font-semibold", t.hot ? "text-white/60" : "text-sub")}>/{yearly ? "year" : "month"}</span>
                </div>
                <ul className={cx("mt-6 space-y-3 flex-1 text-sm", t.hot ? "text-white/85" : "text-sub")}>
                  {ROWS.slice(0, 8).filter((r) => r.values[i] !== false).map((r) => (
                    <li key={r.label} className="flex items-start gap-2.5">
                      <Check className={cx("size-4 mt-0.5 shrink-0", t.hot ? "text-gold" : "text-ok")} />
                      <span>{r.label}{typeof r.values[i] === "string" && <b className={t.hot ? "text-white" : "text-ink"}> — {r.values[i]}</b>}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={t.hot ? "gold" : t.name === "Free" ? "secondary" : "primary"} size="lg" className="mt-8 w-full"
                  onClick={() => t.name === "Free" && !signedIn ? go("/register") : setSelectedTier(t)}>
                  {signedIn && data.plan === t.name ? "Current plan" : t.cta} <ArrowRight className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* full comparison */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink text-center">Compare every feature</h2>
          <div className="mt-8 card overflow-hidden">
            <div className="tbl-wrap">
              <table className="tbl !min-w-[560px]">
                <thead>
                  <tr>
                    <th className="w-[40%]">Feature</th>
                    {TIERS.map((t) => (
                      <th key={t.name} className={cx("text-center", t.hot && "!text-brand")}>{t.name}{t.hot && <span className="ml-1.5 align-middle inline-block w-1.5 h-1.5 rounded-full bg-gold" />}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.label}>
                      <td className="font-semibold text-ink">{r.label}</td>
                      {r.values.map((v, i) => (
                        <td key={i} className="text-center">
                          {v === true ? <Check className="size-4 text-ok inline" />
                            : v === false ? <Minus className="size-4 text-line2 inline" />
                              : <span className="text-[13px] font-bold text-ink">{v}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* reassurance */}
        <div className="mt-16 grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { t: "MoMo-first billing", d: "Pay with the wallet you already use. We prompt you — no card forms." },
            { t: "Cancel anytime", d: "Downgrade back to Free in one tap. Your data stays yours, always exportable." },
            { t: "Free onboarding", d: "Our Accra team will help you set up your first 50 products on any paid plan." },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-line bg-card p-5 text-center hover:-translate-y-0.5 hover:shadow-lift transition-all">
              <p className="font-display font-bold text-ink">{x.t}</p>
              <p className="text-[13px] text-sub mt-1.5 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" onClick={() => go("/register")}>Create your free account <ArrowRight className="size-4" /></Button>
          <p className="text-xs text-faint mt-3">Prices include all taxes. Frontend demo — no real charge is made.</p>
        </div>
      </div>
      <div className="fixed bottom-5 right-5 z-40">
        {aiOpen && (
          <div className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] sm:w-80 rounded-2xl border border-line bg-card p-4 shadow-pop animate-scale-in">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center size-9 rounded-xl bg-navy text-gold shrink-0"><Sparkles className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-bold text-ink">KasaBiz AI</p>
                  <button onClick={() => setAiOpen(false)} aria-label="Close AI assistant" className="text-faint hover:text-ink"><X className="size-4" /></button>
                </div>
                <p className="text-xs text-sub mt-1 leading-relaxed">Not sure which plan fits? Here’s a quick way to compare.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <button onClick={() => setSelectedTier(TIERS[1])} className="flex items-center gap-3 rounded-xl border border-line bg-card2 p-3 text-left hover:border-brand hover:bg-brand-soft transition">
                <span className="grid place-items-center size-8 rounded-lg bg-brand-soft text-brand"><MessageCircle className="size-4" /></span>
                <span className="flex-1"><b className="block text-sm text-ink">Preview Pro</b><span className="text-[11px] text-sub">Best for one busy shop</span></span>
                <ArrowRight className="size-4 text-faint" />
              </button>
              <button onClick={() => setSelectedTier(TIERS[2])} className="flex items-center gap-3 rounded-xl border border-line bg-card2 p-3 text-left hover:border-gold hover:bg-gold-soft transition">
                <span className="grid place-items-center size-8 rounded-lg bg-gold-soft text-gold-deep"><GitBranch className="size-4" /></span>
                <span className="flex-1"><b className="block text-sm text-ink">Preview Business</b><span className="text-[11px] text-sub">For teams and branches</span></span>
                <ArrowRight className="size-4 text-faint" />
              </button>
            </div>
            <p className="text-[10px] text-faint mt-3 text-center">Demo only — no payment is taken.</p>
          </div>
        )}
        <button onClick={() => setAiOpen((open) => !open)} aria-label="Open KasaBiz AI plan assistant"
          className="group flex items-center gap-2 rounded-full bg-navy text-white pl-3 pr-4 py-3 shadow-pop hover:bg-navy3 transition-all hover:-translate-y-1">
          <span className="grid place-items-center size-8 rounded-full bg-gold text-navy"><Sparkles className="size-4" /></span>
          <span className="text-sm font-bold">Ask AI</span>
        </button>
      </div>
      <Modal
        open={!!selectedTier}
        onClose={() => setSelectedTier(null)}
        title={selectedTier ? `Upgrade to ${selectedTier.name}` : undefined}
        sub="See what your business unlocks next."
        footer={
          selectedTier && (
            <>
              <Button variant="secondary" onClick={() => setSelectedTier(null)}>Maybe later</Button>
              <Button variant={selectedTier.hot ? "gold" : "primary"} onClick={() => continueWithTier(selectedTier)}>
                {signedIn ? `Choose ${selectedTier.name}` : "Continue to account"} <ArrowRight className="size-4" />
              </Button>
            </>
          )
        }
      >
        {selectedTier && (
          <div className="space-y-5">
            <div className={cx("rounded-xl p-4 border", selectedTier.hot ? "bg-navy border-navy text-white" : "bg-brand-soft border-brand/10")}>
              <p className={cx("text-xs font-bold uppercase tracking-wider", selectedTier.hot ? "text-gold" : "text-brand")}>{selectedTier.tag}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={cx("font-display font-extrabold text-4xl tnum", selectedTier.hot ? "text-gold" : "text-ink")}>{ghs(yearly ? selectedTier.yearly : selectedTier.price)}</span>
                <span className={cx("text-sm", selectedTier.hot ? "text-white/60" : "text-sub")}>/{yearly ? "year" : "month"}</span>
              </div>
              <p className={cx("text-sm mt-2", selectedTier.hot ? "text-white/70" : "text-sub")}>{selectedTier.blurb}</p>
            </div>
            <div>
              <p className="font-display font-bold text-ink">Everything included</p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {ROWS.map((row) => row.values[TIERS.indexOf(selectedTier)] !== false && (
                  <li key={row.label} className="flex items-start gap-2 text-sm text-sub">
                    <Check className="size-4 mt-0.5 text-ok shrink-0" />
                    <span>{row.label}{typeof row.values[TIERS.indexOf(selectedTier)] === "string" && ` — ${row.values[TIERS.indexOf(selectedTier)]}`}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-faint border-t border-line pt-4">Frontend testing mode — no payment is taken.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
