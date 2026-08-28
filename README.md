# Ariel Builds — Waitlist Site

A one-page site with an email signup form that saves to Supabase.
No build step, no npm, no framework. Open `index.html` in a browser and it runs.

## Files

| File | What it does |
|---|---|
| `index.html` | The page itself — all the words and the form |
| `styles.css` | How it looks. Colors live at the top under `:root` |
| `app.js` | What happens when someone submits the form |
| `config.js` | Your two Supabase keys go here |
| `supabase-setup.sql` | Run this once in Supabase to create the table |

## Setup (short version)

1. Create a Supabase project.
2. SQL Editor → paste `supabase-setup.sql` → Run.
3. Settings → API → copy the **Project URL** and the **anon public** key.
4. Paste both into `config.js`.
5. Push to GitHub, connect the repo to Netlify or Vercel.

The long version with screenshots-worth of detail is in the runbook Claude gave you.

## Running it on your own machine

Double-clicking `index.html` works for looking at it, but the form needs a
real web address to talk to Supabase. To run a tiny local server:

```
cd ariel-builds-waitlist
python3 -m http.server 8000
```

Then open http://localhost:8000

## Reading your signups

Supabase dashboard → Table Editor → `waitlist`.

The public can add rows but cannot read them — that's what the Row Level
Security policy in the SQL file is doing.
