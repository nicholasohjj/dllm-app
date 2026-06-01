# DLLM Laundry Monitor

React/Vite frontend for checking RVREB laundry machine status. The app shows
washer and dryer cards, a floor-plan view, connection state, saved preferred
machines, dark mode, and optional browser push notifications.

## Requirements

- Node.js 20 is the safest match for the Docker image.
- npm is used by the documented commands. A `bun.lock` file is present, but the
  package scripts are standard npm scripts.

## Local Setup

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

## Configuration

Create a local `.env` file when you need live machine data or push
notifications:

```bash
VITE_REACT_APP_LAMBDA_URL=https://example.com/machines
VITE_REACT_APP_WEBSOCKET_URL=wss://example.com/machines
VITE_VAPID_PUBLIC_KEY=your_public_vapid_key
```

`VITE_REACT_APP_WEBSOCKET_URL` is preferred for live updates. If it is missing,
the app tries to derive a WebSocket URL from `VITE_REACT_APP_LAMBDA_URL` and
falls back to HTTP fetching when needed.

The push subscription API also expects server-side VAPID variables:

```bash
VAPID_PUBLIC_KEY=your_public_vapid_key
VAPID_PRIVATE_KEY=your_private_vapid_key
VAPID_SUBJECT=mailto:you@example.com
```

The current `api/subscribe.js` and `api/unsubscribe.js` handlers only validate
and log subscriptions. Replace the mock database functions before relying on
push notifications in production.

## Scripts

```bash
npm run dev           # Start Vite
npm run build         # Type-check and build to dist/
npm run preview       # Serve the production build locally
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with fixes
npm run format        # Format with Prettier
npm run format:check  # Check Prettier formatting
npm run check         # Run lint and format checks
```

## Production Build

```bash
npm run build
npm run preview
```

The build output goes to `dist/`. The app is a client-side routed SPA, so the
web server should serve `index.html` for unknown routes.

## Docker and Nginx

The repository includes a Dockerfile and nginx config for static hosting:

```bash
docker-compose up -d
```

That serves the built app on `http://localhost`. Static nginx hosting does not
run the files in `api/`; proxy `/api/` to a backend if you deploy push
subscription handlers separately.

More detail:

- [Nginx deployment](docs/nginx-deployment.md)
- [Web push setup](docs/web-push-setup.md)

## Project Layout

```text
api/                    Push subscription handlers
docs/                   Deployment and web-push notes
public/                 Icons, screenshot, and service worker
src/components/laundry/ Main laundry monitor UI
src/hooks/              Machine setup, WebSocket, and toast hooks
src/contexts/           Dark mode context
src/types/              Shared TypeScript types
nginx.conf              Static hosting config
Dockerfile              Production image
docker-compose.yml      Local container runner
```
