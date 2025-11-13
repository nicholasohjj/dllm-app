# Quick Start Guide - Push Notifications

Get push notifications working in **5 minutes**! ⚡

## Step 1: Generate VAPID Keys (30 seconds)

```bash
npm run generate-vapid
```

You should see:
```
✅ VAPID keys generated successfully!
✅ Created .env file with your VAPID keys
```

## Step 2: Update Your Email (15 seconds)

Open `.env` and change the subject line:

```env
VAPID_SUBJECT=mailto:YOUR-EMAIL@example.com
```

Replace `YOUR-EMAIL@example.com` with your actual email or website URL.

## Step 3: Start the App (15 seconds)

```bash
npm run dev
```

Wait for:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

## Step 4: Enable Notifications (30 seconds)

1. Open http://localhost:5173 in your browser
2. Click the 🔔 bell icon in the top-right corner
3. Click **"Allow"** when the browser asks for permission
4. The bell icon should turn **green** ✅

## Step 5: Test It! (1 minute)

### Quick Test - Browser Console

1. Press `F12` to open DevTools
2. Go to the **Console** tab
3. Paste this code and press Enter:

```javascript
navigator.serviceWorker.ready.then(reg => 
  reg.showNotification('🎉 It Works!', {
    body: 'Your push notifications are working!',
    icon: '/icons/android-chrome-192x192.png',
    vibrate: [200, 100, 200]
  })
);
```

You should see a notification appear! 🎉

---

## What You Just Did

✅ Generated cryptographic keys for push notifications  
✅ Configured your app with those keys  
✅ Registered a Service Worker in the browser  
✅ Subscribed to push notifications  
✅ Sent a test notification  

## Next Steps

### Learn More
- [Full Setup Guide](push-notifications-setup.md) - Comprehensive documentation
- [Testing Guide](push-notifications-testing.md) - Testing scenarios and debugging

### Add Real Notifications

To send notifications from your server (when laundry is done, etc.):

1. **Save subscriptions** to a database (the subscription object)
2. **Set up a server** with the `web-push` library
3. **Send notifications** when events happen (machine finishes, etc.)

Example server code:

```javascript
const webpush = require('web-push');

// Configure VAPID
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Send notification
const subscription = /* get from database */;
const payload = JSON.stringify({
  title: 'Laundry Done! 🧺',
  body: 'Your washer W01 has finished',
  data: { url: '/', machineId: 'W01' }
});

webpush.sendNotification(subscription, payload);
```

### Deploy to Production

When ready to deploy:

1. Deploy to a platform with **HTTPS** (required!)
2. Set environment variables on the platform
3. Test in production environment
4. Set up backend API for sending notifications

See [Production Deployment](push-notifications-setup.md#production-deployment) for details.

## Troubleshooting

### "VAPID public key is not configured"
→ Run `npm run generate-vapid` and restart the dev server

### Bell icon is grayed out
→ Your browser doesn't support push notifications (try Chrome/Firefox)

### Permission denied
→ Check browser settings > Site Settings > Notifications

### No notification appears
→ Check if notifications are blocked in system settings

### Service Worker errors
→ Open DevTools > Application > Service Workers to see errors

## Common Commands

```bash
# Generate new VAPID keys
npm run generate-vapid

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run lint
```

## Need Help?

1. Check the [Full Setup Guide](push-notifications-setup.md)
2. Review [Common Issues](push-notifications-setup.md#troubleshooting)
3. Check browser console for errors
4. Verify Service Worker is registered (DevTools > Application)

---

**That's it!** You now have push notifications working in your app! 🚀

For more advanced usage, see the [full documentation](push-notifications-setup.md).

