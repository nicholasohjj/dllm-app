# Push Notifications Testing Guide

Quick guide for testing push notifications in your local development environment.

## Quick Test Steps

### 1. Setup (First Time Only)

```bash
# Generate VAPID keys
npm run generate-vapid

# Update .env file with your email
# Open .env and change:
VAPID_SUBJECT=mailto:your-actual-email@example.com

# Start development server
npm run dev
```

### 2. Subscribe to Notifications

1. Open the app in your browser (http://localhost:5173)
2. Click the bell icon (🔔) in the header
3. When prompted, click "Allow" for notifications
4. You should see a green bell icon indicating you're subscribed

### 3. Send a Test Notification

#### Method 1: Using Browser DevTools

Open the browser console (F12) and paste this code:

```javascript
// Send a test notification
navigator.serviceWorker.ready.then((registration) => {
  registration.showNotification('Test Notification', {
    body: 'This is a test from the browser console!',
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: { url: '/' },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Close' }
    ]
  });
});
```

#### Method 2: Using the React Hook

Add this to your component temporarily:

```typescript
import { usePushNotifications } from '@/hooks/usePushNotifications';

function TestComponent() {
  const { sendTestNotification } = usePushNotifications();
  
  return (
    <Button onClick={sendTestNotification}>
      Send Test Notification
    </Button>
  );
}
```

#### Method 3: Simulating a Server Push

Create a test file `test-push.js`:

```javascript
const webpush = require('web-push');

// Set VAPID details
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  'YOUR_PUBLIC_KEY',
  'YOUR_PRIVATE_KEY'
);

// Get the subscription from your browser console:
// navigator.serviceWorker.ready.then(reg => 
//   reg.pushManager.getSubscription().then(sub => console.log(JSON.stringify(sub)))
// );

const subscription = {
  endpoint: 'YOUR_ENDPOINT',
  keys: {
    p256dh: 'YOUR_P256DH_KEY',
    auth: 'YOUR_AUTH_KEY'
  }
};

const payload = JSON.stringify({
  title: 'Laundry Update',
  body: 'Your washer W01 has finished!',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [200, 100, 200, 100, 200],
  data: {
    url: '/',
    machineId: 'W01',
    timestamp: Date.now()
  },
  actions: [
    { action: 'view', title: 'View Machine' },
    { action: 'dismiss', title: 'Dismiss' }
  ]
});

webpush.sendNotification(subscription, payload)
  .then(response => console.log('✅ Notification sent:', response.statusCode))
  .catch(error => console.error('❌ Error:', error));
```

Run it:
```bash
node test-push.js
```

## Verification Checklist

- [ ] Bell icon appears in the app header
- [ ] Clicking bell prompts for notification permission
- [ ] Permission dialog appears
- [ ] After allowing, bell icon turns green
- [ ] Test notification appears
- [ ] Notification has correct icon and title
- [ ] Clicking notification opens/focuses the app
- [ ] Unsubscribing turns bell icon back to outline
- [ ] No console errors

## Common Test Scenarios

### Scenario 1: New User

1. Fresh browser (no previous subscription)
2. Click bell icon
3. Grant permission
4. Verify subscription successful
5. Send test notification
6. Verify notification appears

### Scenario 2: Returning User

1. User already subscribed (from previous session)
2. Page loads
3. Bell icon should be green (subscribed state)
4. Send test notification
5. Verify notification appears

### Scenario 3: Unsubscribe

1. User is subscribed (green bell)
2. Click bell icon to unsubscribe
3. Bell icon changes to outline
4. Send test notification
5. Verify notification does NOT appear

### Scenario 4: Permission Denied

1. User clicks bell icon
2. User denies permission
3. Verify error toast appears
4. Bell icon remains in unsubscribed state
5. Help text explains how to re-enable

### Scenario 5: Unsupported Browser

1. Open in older browser (or simulate)
2. Bell icon should be disabled
3. Hover shows "not supported" message
4. No errors in console

## Browser-Specific Testing

### Chrome/Edge

```javascript
// Check permission status
Notification.permission // 'granted', 'denied', or 'default'

// Check subscription
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    console.log('Subscription:', sub);
  });
});

// View Service Worker
// Chrome DevTools > Application > Service Workers
```

### Firefox

```javascript
// Same as Chrome, but check:
// DevTools > Application > Service Workers (may be in different location)
```

### Safari (macOS 13+, iOS 16.4+)

```javascript
// Safari has stricter requirements
// Must be HTTPS in production
// May need user interaction before permission prompt
```

## Debugging Tips

### Enable Verbose Logging

Add this to your Service Worker:

```javascript
self.addEventListener('push', (event) => {
  console.log('[Push] Event:', event);
  console.log('[Push] Data:', event.data ? event.data.text() : 'no data');
  // ... rest of push handler
});
```

### Check Service Worker Status

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registrations:', registrations.length);
  registrations.forEach((reg, i) => {
    console.log(`[${i}]`, reg);
  });
});
```

### Force Service Worker Update

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => {
    reg.update();
    console.log('Service Worker updated');
  });
});
```

### Clear Everything and Start Fresh

```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// Clear all caches
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});

// Clear local storage
localStorage.clear();

// Then reload the page
location.reload();
```

## Automated Testing

### Using Playwright

```javascript
import { test, expect } from '@playwright/test';

test('should subscribe to push notifications', async ({ page, context }) => {
  // Grant notification permission
  await context.grantPermissions(['notifications']);
  
  await page.goto('http://localhost:5173');
  
  // Click bell icon
  await page.click('[title="Subscribe to notifications"]');
  
  // Wait for success toast
  await expect(page.locator('text=Subscribed')).toBeVisible();
  
  // Verify bell icon is green
  await expect(page.locator('.text-green-500')).toBeVisible();
});
```

### Using Cypress

```javascript
describe('Push Notifications', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    // Stub notification permission
    cy.window().then((win) => {
      cy.stub(win.Notification, 'permission').returns('granted');
    });
  });

  it('should subscribe to notifications', () => {
    cy.get('[title*="Subscribe"]').click();
    cy.contains('Subscribed').should('be.visible');
    cy.get('.text-green-500').should('exist');
  });
});
```

## Performance Testing

### Check Service Worker Size

```bash
# Check service-worker.js size
ls -lh public/service-worker.js
```

### Measure Notification Delivery Time

```javascript
const startTime = Date.now();

navigator.serviceWorker.ready.then((registration) => {
  registration.showNotification('Performance Test', {
    body: 'Testing delivery time'
  }).then(() => {
    const endTime = Date.now();
    console.log(`Notification shown in ${endTime - startTime}ms`);
  });
});
```

## Production Testing Checklist

Before deploying to production:

- [ ] Test on real devices (not just localhost)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test with poor network conditions
- [ ] Test notification actions (clicking, dismissing)
- [ ] Test with multiple browser tabs open
- [ ] Test unsubscribe flow
- [ ] Test re-subscribe after unsubscribe
- [ ] Verify HTTPS is working
- [ ] Verify environment variables are set
- [ ] Test notification payload size limits
- [ ] Test notification rate limiting
- [ ] Monitor console for errors

## Troubleshooting Tests

### Test Not Working?

1. Check browser console for errors
2. Verify Service Worker is registered (DevTools > Application)
3. Check notification permission (should be 'granted')
4. Verify VAPID keys are set in .env
5. Restart dev server after changing .env
6. Try clearing Service Worker cache
7. Try in incognito/private window

### Still Not Working?

Check:
- [ ] Browser supports push notifications
- [ ] Using HTTPS (or localhost)
- [ ] Service Worker registered successfully
- [ ] No CORS errors in console
- [ ] Environment variables loaded correctly
- [ ] VAPID keys are valid

---

Happy Testing! 🧪

