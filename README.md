# TinyLink — Next.js Starter (MVP)

This is a minimal, autograder-friendly starter for the TinyLink take-home assignment.
It includes a Next.js Pages Router structure, Prisma schema, API routes and simple UI pages.

**What's included**
- `pages/` routes: `/` (dashboard), `/code/[code]` (stats), `/:code` (redirect), `/healthz`
- `pages/api/links` endpoints: POST, GET, GET /:code, DELETE /:code
- `prisma/schema.prisma` sample schema
- `.env.example`
- `package.json` with scripts
- Minimal Tailwind setup files and CSS placeholders

## How to run locally (summary)
1. Install dependencies: `npm install`
2. Create a Postgres database (Neon recommended) and set `DATABASE_URL` in `.env`
3. Run Prisma migrate: `npx prisma migrate dev --name init`
4. Start dev server: `npm run dev`

## Notes for submission
- Ensure the deployed base URL is set in `NEXT_PUBLIC_BASE_URL`
- Health endpoint: `GET /healthz` returns `{"ok": true, "version":"1.0"}`
- Redirect endpoint `/:code` must return HTTP 302 to the target URL and increment clicks
- Follow the field names and endpoint paths exactly as required by the assignment

Good luck! If you want, I can now prepare a GitHub-ready repo with commits or help deploy to Vercel+Neon.
