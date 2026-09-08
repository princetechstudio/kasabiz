# Sika Boafo

## Local setup

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project.
4. Set `VITE_PAYSTACK_PUBLIC_KEY` if paid checkout is enabled.
5. Run `npm install`, then `npm run dev`.

## Production release

1. Apply the SQL files in `supabase/migrations` to the production Supabase project.
2. In Supabase Authentication, configure the production site URL and redirect URL:
   `https://your-domain.example/#/auth/callback`
3. Configure Google OAuth only if Google sign-in is enabled.
4. Build with `npm run build`.
5. Deploy the complete `dist` folder to a static host with SPA fallback to `index.html`.
6. Serve the site over HTTPS and set the production environment variables in the hosting provider.
7. Test registration, email confirmation, login, product creation, sales, reports, logout, and mobile scrolling.

The app uses hash-based routes, so the host must serve `index.html` for `/` and must not rewrite JavaScript or CSS asset requests to HTML. The service worker cache is versioned in `public/sw.js`; deploy that file with every release.

## CEO dashboard

Apply `supabase/migrations/006_ceo_pin.sql` and then `supabase/migrations/007_fix_ceo_pin_pgcrypto.sql` to production. If the old `gen_salt` error remains, rerun the complete 007 file; it recreates the functions after installing `pgcrypto` in the `extensions` schema. A signed-in business owner can open Settings, create a 4-digit CEO PIN, and then open `/#/ceo`. The PIN is hashed and verified inside Supabase; it is never stored in browser storage. The dashboard is scoped to the signed-in owner's business.

## Developer console

Set `VITE_DEVELOPER_EMAILS` to one or more comma-separated Supabase account emails, then rebuild:

```bash
VITE_DEVELOPER_EMAILS=you@example.com
npm run build
```

The private console is available at `/#/admin`. Users whose signed-in email is not on this list receive 404. For a multi-tenant production deployment, replace the client-side allowlist with a server-side Supabase role/custom claim before adding sensitive administrative actions.
