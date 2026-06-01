# Web Push Setup

The browser needs a public VAPID key to create a push subscription, and the API
needs the matching private key when it sends notifications.

## Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

## Frontend Environment

Add the public key to your Vite environment:

```bash
VITE_VAPID_PUBLIC_KEY=your_public_key
```

Rebuild the app after changing Vite environment variables.

## API Environment

Configure these variables wherever `/api/subscribe` and your notification sender
run:

```bash
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your-email@example.com
```

## Deployment Notes

The current `/api/subscribe` and `/api/unsubscribe` handlers only validate and
log subscriptions. Replace the mock database functions with persistent storage
before relying on notifications in production.

If the app is served by nginx, proxy `/api/` to the backend that hosts these
handlers. Static nginx hosting alone cannot run the API files in this repo.
