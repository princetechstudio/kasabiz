import React from "react";
import { ArrowRight, CalendarCheck, CheckCircle2, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, KenteBar } from "../../components/ui";

export default function Demo() {
  const [sent, setSent] = React.useState(false);
  return (
    <div>
      <section className="public-hero relative overflow-hidden bg-navy text-white">
        <div aria-hidden className="hero-orb hero-orb-gold" /><div aria-hidden className="hero-grid" /><KenteBar className="rounded-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <Badge tone="gold"><CalendarCheck className="size-3.5" /> Product walkthrough</Badge>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl max-w-3xl mt-5">See how Sika Boafo can fit your business.</h1>
          <p className="text-white/70 text-lg mt-5 max-w-2xl">Tell us what you sell and we’ll show you the fastest way to track sales, stock, profit and customers.</p>
        </div>
      </section>
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-10">
          <div><h2 className="font-display font-extrabold text-3xl text-ink">A short, practical demo</h2><p className="text-sub mt-3 leading-relaxed">No pressure and no complicated setup. We’ll focus on the workflow that matters most to you.</p><ul className="mt-7 space-y-4 text-sm text-sub">{["Dashboard tour", "Sales and inventory walkthrough", "Plan recommendation"].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="size-4 text-ok shrink-0" />{x}</li>)}</ul><div className="mt-8 space-y-3 text-sm text-sub"><p className="flex gap-2"><Phone className="size-4 text-gold" /> 030 274 8899</p><p className="flex gap-2"><Mail className="size-4 text-gold" /> hello@kasabiz.app</p></div></div>
          <form className="rounded-2xl border border-line bg-card p-6 sm:p-8 shadow-lift" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            {sent ? <div className="py-12 text-center"><CheckCircle2 className="size-12 text-ok mx-auto" /><h2 className="font-display font-bold text-2xl text-ink mt-4">Request received</h2><p className="text-sub mt-2">Our team will contact you to arrange a convenient time.</p><Link to="/"><Button className="mt-6">Back home <ArrowRight className="size-4" /></Button></Link></div> : <><h2 className="font-display font-bold text-xl text-ink">Request your walkthrough</h2><div className="mt-5 grid sm:grid-cols-2 gap-4">{[["name","Your name"],["business","Business name"],["email","Email address"],["phone","Phone number"]].map(([name, label]) => <label key={name} className="text-sm font-semibold text-ink">{label}<input required name={name} className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-brand" /></label>)}</div><label className="block mt-4 text-sm font-semibold text-ink">What kind of business do you run?<select name="type" className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm"><option>Retail shop</option><option>Food business</option><option>Salon or beauty business</option><option>Other SME</option></select></label><Button type="submit" size="lg" className="mt-6 w-full">Request demo <ArrowRight className="size-4" /></Button><p className="text-[11px] text-faint mt-3 text-center">This demo form is a frontend preview and does not send real email yet.</p></>}</form>
        </div>
      </section>
    </div>
  );
}
