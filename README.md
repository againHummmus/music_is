# musicIs

A small music social network: users listen to tracks, build playlists, follow each other, write posts and send private messages. Artists upload tracks and albums. The app suggests people with similar taste based on likes.

It is a personal non-commercial project. Live at https://music-is.space.

## Stack

Next.js 14 (App Router, server components, server actions), React 18, TypeScript, Tailwind CSS, Zustand for client state. Supabase provides the Postgres database, auth, file storage and realtime updates for messages. Hosted on Vercel.

## Project structure

- `src/app`: routes only. Each `page.tsx` loads data and renders a screen. `(public)` holds pages available without an account (landing, auth, legal pages), `(app)` holds everything behind sign-in.
- `src/screens`: page-level components, one folder per page.
- `src/components`: shared UI: layout, player, tracks, playlists, users, posts.
- `src/actions`: server actions and data access. `types.ts` keeps the select strings and the row types derived from them. `session.ts` resolves the current user once per request.
- `src/hooks`: client hooks (infinite lists, search, file preview, dialogue messages).
- `src/stores`: Zustand stores for auth, player, likes and modals.
- `src/lib`: Supabase clients, uploads, site config and small utilities.
- `src/middleware.ts`: refreshes the auth session and redirects signed-out users away from private pages.

## Music

The demo catalogue consists of public-domain (CC0) recordings by Musopen and other performers from Wikimedia Commons. Composer portraits and covers are public-domain images from Wikimedia Commons.
