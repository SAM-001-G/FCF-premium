# FCF — The Mountain of Possibilities

Public website + admin dashboard for Faith in Christ Fellowship, built with React (Vite) and Supabase.

## What's included (V1 skeleton)

**Public site:** Home, About, Events (with live countdown), Sermons (with search), Ministries,
Prayer Request form, Testimonies (feed + submission), Gallery, Give, Plan Your Visit, Contact.

**Admin dashboard** (`/admin`, requires login): overview stats, Events CRUD, Sermons CRUD,
Announcements CRUD, Ministries CRUD, Prayer Requests queue (status workflow), Testimonies
moderation queue (pending → approved → published), Visitors queue.

**Backend:** Live Supabase project (`fcf-mountain-of-possibilities`) with all tables, Row Level
Security policies (public can read published content and submit forms; only authenticated
admins can write), and the two seeded events.

## Running it locally

```bash
npm install
npm run dev
```

The `.env` file is already wired to the live Supabase project — no setup needed to start
developing against real data.

## Creating your first admin account

Admin accounts aren't self-service (by design). To create one:
1. Go to the Supabase dashboard for this project → Authentication → Users → Add User
2. Create the user with an email + password
3. That person can then log in at `/admin/login`

(Optional) To give them a role label, insert a row into `admin_profiles` with their user id.

## Deploying

This is a standard Vite React app — deploy it to Vercel, Netlify, or any static host that
supports SPA routing. Set the same two environment variables shown in `.env` in your host's
dashboard, then run `npm run build` and deploy the `dist/` folder. If you deploy via Vercel,
make sure to add a rewrite/fallback rule so all routes serve `index.html` (client-side routing).

## What's NOT built yet (V2)

- WhatsApp integration (click-to-chat buttons, admin → WhatsApp event sharing, WhatsApp Business API)
- M-PESA payment integration for Give (currently just displays placeholder info)
- PWA install prompt / push notifications (manifest is in place, service worker is not)
- Leadership profiles, ministries, gallery albums — tables exist but are empty; add content via
  the admin dashboard (leadership doesn't have an admin page yet — add via Supabase table editor
  for now, or ask to have that CRUD page built)
- Admin roles & permissions (all authenticated users currently have full access — role-based
  restriction by the `admin_profiles.role` column is not yet enforced)
- Event registration/RSVP, smart reminders, live service banner, scripture-of-the-day, and the
  other "wow" features from the original feature list

## Brand

Navy `#0B2545` · Sky Blue `#4FA8D8` · Gold `#C9A24B` · White — gold used as an accent.
Tagline: "Where Faith Meets Possibility."
