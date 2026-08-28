# Ariel Builds — Site

One page, two asks, both saving to Supabase.
No build step, no npm, no framework. Open `index.html` in a browser and it runs.

## The two asks, ranked

1. **Discovery Session request** — the primary CTA. Saves to `discovery_requests`.
2. **Field Notes email list** — the quiet secondary option. Saves to `waitlist`.

## Files

| File | What it does |
|---|---|
| `index.html` | The page — all the words and both forms |
| `styles.css` | How it looks. Every color and font is at the top under `:root` |
| `app.js` | What happens when either form is submitted |
| `config.js` | The two Supabase connection values |
| `supabase-setup.sql` | Run once in Supabase to create both tables |

## Design

Built on the **Ariel Builds Asset Library v1**.

- Archivo for everything read; IBM Plex Mono for labels only, uppercase and tracked
- Terracotta `#A94427` on light grounds, clay `#F09A72` on charcoal, never both in one block
- The wordmark is `ARIEL BUILDS.` — only the period takes the accent color

Change any token in `:root` and it changes everywhere.

## Running it locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Reading submissions

Supabase dashboard → Table Editor → `discovery_requests` or `waitlist`.

The public can add rows but cannot read them. That's the Row Level Security
policy plus the table grants in `supabase-setup.sql` — both are required.
