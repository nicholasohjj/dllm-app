# Push Notifications Setup Guide

This guide will help you set up and test push notifications for the DLLM Laundry Monitor app.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Generating VAPID Keys](#generating-vapid-keys)
4. [Configuration](#configuration)
5. [Testing Push Notifications](#testing-push-notifications)
6. [Troubleshooting](#troubleshooting)
7. [Browser Support](#browser-support)
8. [Production Deployment](#production-deployment)

## Prerequisites

- Node.js (v14 or higher)
- Modern browser (Chrome, Firefox, Edge, Safari 16+)
- HTTPS connection (required for push notifications in production)

## Quick Start

### 1. Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for push notifications:

```bash
npm run generate-vapid
```

This will:
- Generate a new pair of VAPID keys
- Create/update your `.env` file with the keys
- Create/update the `.env.example` template

### 2. Configure Environment Variables

Copy the generated keys to your `.env` file (should be created automatically):

```env
# Public key (used in the frontend)
VITE_VAPID_PUBLIC_KEY=your-generated-public-key

# Private key (used in the backend)
VAPID_PRIVATE_KEY=your-generated-private-key

# Your email or website URL
VAPID_SUBJECT=mailto:your-email@example.com

# Your Lambda API URL (if you have one)
VITE_REACT_APP_LAMBDA_URL=your-lambda-url
```

**Important:** 
- Replace `your-email@example.com` with your actual email or website URL
- Never commit the `.env` file to version control
- The `.env` file should be in your `.gitignore`

### 3. Restart Development Server

After setting up the environment variables, restart your development server:

```bash
npm run dev
```

## Generating VAPID Keys

### What are VAPID Keys?

VAPID keys are a pair of cryptographic keys (public and private) used to identify your application when sending push notifications. They ensure that only your server can send push notifications to your subscribers.

### Generating Keys

Run the following command:

```bash
npm run generate-vapid
```

The script will:
1. Generate a new public/private key pair
2. Save them to your `.env` file
3. Display the keys in the console
4. Create an example configuration file

### Manual Generation (Alternative)

If you need to generate keys manually:

```javascript
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
```

## Configuration

### Frontend Configuration

The frontend needs the public VAPID key to subscribe to push notifications. This is configured via environment variables:

```env
VITE_VAPID_PUBLIC_KEY=your-public-key-here
```

This key is:
- **Safe to expose** in client-side code
- Used when subscribing to push notifications
- Base64 URL-encoded

### Backend Configuration (API)

The backend needs the private key to send push notifications:

```env
VAPID_PRIVATE_KEY=your-private-key-here
VAPID_SUBJECT=mailto:your-email@example.com
```

**Keep the private key secure!** Never:
- Commit it to version control
- Share it publicly
- Include it in client-side code

### Service Worker Registration

The service worker is automatically registered in the `LaundryMonitor` component:

```typescript
useEffect(() => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
}, []);
```

## Testing Push Notifications

### 1. Enable Notifications in Your Browser

1. Click the bell icon in the app header
2. When prompted, click "Allow" to enable notifications
3. You should see a success toast message

### 2. Test Notification (Browser Console)

You can send a test notification using the browser console:

```javascript
// Get the service worker registration
navigator.serviceWorker.ready.then((registration) => {
  registration.showNotification('Test Notification', {
    body: 'This is a test notification!',
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: { url: '/' },
  });
});
```

### 3. Test with the Hook

The `usePushNotifications` hook provides a `sendTestNotification` method:

```typescript
const { sendTestNotification } = usePushNotifications();

// Call this to send a test notification
sendTestNotification();
```

### 4. Test Server-Side Push (Backend Required)

To test actual push notifications from your server, you'll need to set up the backend API:

```javascript
// Example using web-push library
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Send notification to a subscription
const subscription = {
  endpoint: '...',
  keys: {
    p256dh: '...',
    auth: '...'
  }
};

const payload = JSON.stringify({
  title: 'Laundry Update',
  body: 'Your laundry is ready!',
  icon: '/icons/android-chrome-192x192.png',
  data: { url: '/', machineId: 'W01' }
});

webpush.sendNotification(subscription, payload)
  .then(response => console.log('Notification sent:', response))
  .catch(error => console.error('Error sending notification:', error));
```

## Troubleshooting

### Common Issues

#### 1. "Push notifications are not supported"

**Causes:**
- Browser doesn't support push notifications
- Not using HTTPS (required in production)
- Service Worker failed to register

**Solutions:**
- Use a supported browser (Chrome, Firefox, Edge, Safari 16+)
- Ensure you're using HTTPS in production
- Check the browser console for Service Worker errors

#### 2. "VAPID public key is not configured"

**Causes:**
- Environment variable not set
- `.env` file not loaded
- Dev server not restarted after adding variables

**Solutions:**
- Run `npm run generate-vapid` to generate keys
- Ensure `.env` file exists in the project root
- Restart the development server

#### 3. Notifications not appearing

**Causes:**
- Notification permission denied
- Service Worker not registered
- Browser notifications disabled in system settings

**Solutions:**
- Check browser notification permission (browser settings)
- Verify Service Worker is registered (DevTools > Application > Service Workers)
- Check system notification settings (OS level)

#### 4. Service Worker errors

**Causes:**
- Syntax errors in service-worker.js
- Caching issues
- Incorrect service worker scope

**Solutions:**
- Check browser console for errors
- Clear browser cache and Service Worker cache
- Unregister and re-register the Service Worker:

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### Debug Mode

Enable verbose logging in the Service Worker:

1. Open DevTools
2. Go to Application > Service Workers
3. Check the console for Service Worker logs
4. Look for messages prefixed with "Service Worker:"

### Checking Subscription Status

Check if the user is subscribed:

```javascript
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(subscription => {
    if (subscription) {
      console.log('User is subscribed:', subscription);
    } else {
      console.log('User is not subscribed');
    }
  });
});
```

## Browser Support

### Desktop Browsers

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 42+     | ✅ Full |
| Firefox | 44+     | ✅ Full |
| Edge    | 17+     | ✅ Full |
| Safari  | 16+     | ✅ Full |
| Opera   | 37+     | ✅ Full |

### Mobile Browsers

| Browser | Platform | Support |
|---------|----------|---------|
| Chrome  | Android  | ✅ Full |
| Firefox | Android  | ✅ Full |
| Safari  | iOS 16.4+ | ✅ Full |
| Samsung Internet | Android | ✅ Full |

### Feature Detection

The app automatically detects if push notifications are supported:

```typescript
const isSupported = 
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window;
```

## Production Deployment

### Requirements

1. **HTTPS**: Push notifications require a secure context
2. **Valid SSL Certificate**: Self-signed certificates won't work
3. **Proper VAPID Configuration**: Ensure environment variables are set

### Deployment Checklist

- [ ] Generate production VAPID keys
- [ ] Set environment variables on hosting platform
- [ ] Configure VAPID_SUBJECT with production email/URL
- [ ] Ensure site is served over HTTPS
- [ ] Test notifications on production domain
- [ ] Set up backend API for sending notifications
- [ ] Configure database to store subscriptions
- [ ] Implement subscription management (add/remove)
- [ ] Set up notification triggers (e.g., when laundry is done)
- [ ] Test on multiple browsers and devices

### Environment Variables on Popular Platforms

#### Vercel
```bash
vercel env add VITE_VAPID_PUBLIC_KEY
vercel env add VAPID_PRIVATE_KEY
vercel env add VAPID_SUBJECT
```

#### Netlify
Add in `netlify.toml`:
```toml
[build.environment]
  VITE_VAPID_PUBLIC_KEY = "your-public-key"
```

Or via Netlify UI: Site settings > Build & deploy > Environment

#### Heroku
```bash
heroku config:set VITE_VAPID_PUBLIC_KEY=your-public-key
heroku config:set VAPID_PRIVATE_KEY=your-private-key
heroku config:set VAPID_SUBJECT=mailto:your-email@example.com
```

### Backend API Setup

For production, you'll need to:

1. **Store Subscriptions**: Save subscription objects to a database
2. **Send Notifications**: Create an API endpoint to trigger notifications
3. **Handle Expiration**: Remove expired subscriptions
4. **Rate Limiting**: Implement rate limiting to prevent abuse

Example API structure:
```
POST /api/subscribe    - Subscribe to notifications
POST /api/unsubscribe  - Unsubscribe from notifications
POST /api/send         - Send notification (internal/admin only)
```

## Additional Resources

- [Web Push API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)
- [web-push Library](https://github.com/web-push-libs/web-push)

## Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console logs
3. Verify Service Worker registration
4. Check notification permissions
5. Ensure environment variables are set correctly

---

**Last Updated:** November 2024

