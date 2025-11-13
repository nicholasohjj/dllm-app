# Push Notification Examples

This document provides examples of different types of push notifications you can send in the DLLM Laundry Monitor app.

## Basic Notification

The simplest notification with just a title and body:

```javascript
{
  title: 'DLLM Laundry Monitor',
  body: 'Your laundry is ready!',
  icon: '/icons/android-chrome-192x192.png'
}
```

## Machine Complete Notification

Notify when a specific machine finishes:

```javascript
{
  title: '🎉 Washer Ready!',
  body: 'Washer W01 has completed its cycle',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [200, 100, 200],
  tag: 'machine-w01-complete',
  requireInteraction: true,
  data: {
    url: '/',
    machineId: 'W01',
    type: 'machine-complete',
    timestamp: Date.now()
  },
  actions: [
    {
      action: 'view',
      title: 'View Machine',
      icon: '/icons/android-chrome-192x192.png'
    },
    {
      action: 'dismiss',
      title: 'Dismiss',
      icon: '/icons/android-chrome-192x192.png'
    }
  ]
}
```

## Machine Available Notification

Notify when a preferred machine becomes available:

```javascript
{
  title: '✨ Your Favorite Machine is Available!',
  body: 'Washer W03 is now available',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [100, 50, 100],
  tag: 'machine-w03-available',
  renotify: true,
  data: {
    url: '/',
    machineId: 'W03',
    type: 'machine-available',
    isPreferred: true
  },
  actions: [
    {
      action: 'reserve',
      title: 'Reserve Now',
      icon: '/icons/android-chrome-192x192.png'
    },
    {
      action: 'later',
      title: 'Maybe Later',
      icon: '/icons/android-chrome-192x192.png'
    }
  ]
}
```

## Time Remaining Notification

Notify when machine has 5 minutes remaining:

```javascript
{
  title: '⏰ Almost Done!',
  body: 'Dryer D04 has 5 minutes remaining',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [100, 50, 100, 50, 100],
  tag: 'machine-d04-finishing',
  data: {
    url: '/',
    machineId: 'D04',
    type: 'machine-finishing',
    timeRemaining: 5
  },
  actions: [
    {
      action: 'remind',
      title: 'Remind in 3 min',
      icon: '/icons/android-chrome-192x192.png'
    }
  ]
}
```

## All Machines Busy Notification

Notify when all machines are in use:

```javascript
{
  title: '😔 All Machines Busy',
  body: 'All washers are currently in use. We\'ll notify you when one becomes available.',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [100],
  tag: 'all-busy',
  data: {
    url: '/',
    type: 'all-busy'
  },
  actions: [
    {
      action: 'notify',
      title: 'Notify When Available',
      icon: '/icons/android-chrome-192x192.png'
    }
  ]
}
```

## Maintenance Notification

Notify about machine maintenance:

```javascript
{
  title: '🔧 Maintenance Alert',
  body: 'Washer W05 is temporarily out of service for maintenance',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [200, 100, 200],
  tag: 'maintenance-w05',
  requireInteraction: true,
  data: {
    url: '/',
    machineId: 'W05',
    type: 'maintenance',
    severity: 'warning'
  }
}
```

## Scheduled Reminder

User-scheduled reminder:

```javascript
{
  title: '⏰ Laundry Reminder',
  body: 'Time to check on your laundry!',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [300, 100, 300],
  tag: 'user-reminder',
  requireInteraction: true,
  data: {
    url: '/',
    type: 'reminder',
    scheduledBy: 'user'
  },
  actions: [
    {
      action: 'open',
      title: 'Check Now',
      icon: '/icons/android-chrome-192x192.png'
    },
    {
      action: 'snooze',
      title: 'Snooze 5 min',
      icon: '/icons/android-chrome-192x192.png'
    }
  ]
}
```

## Silent Notification (Data Only)

For background sync without showing a notification:

```javascript
{
  title: 'Background Sync',
  body: 'Machine status updated',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  silent: true,
  data: {
    type: 'sync',
    machines: [
      { id: 'W01', status: 'available' },
      { id: 'D02', status: 'in-use', timeRemaining: 15 }
    ]
  }
}
```

## Progressive Notification

Update existing notification with new information:

```javascript
// Initial notification
{
  title: 'Washer Running',
  body: '30 minutes remaining',
  tag: 'machine-w01-progress',
  data: { machineId: 'W01', timeRemaining: 30 }
}

// Update after 15 minutes (same tag)
{
  title: 'Washer Running',
  body: '15 minutes remaining',
  tag: 'machine-w01-progress',
  renotify: true,
  data: { machineId: 'W01', timeRemaining: 15 }
}

// Final update (same tag)
{
  title: '🎉 Washer Complete!',
  body: 'Your laundry is ready',
  tag: 'machine-w01-progress',
  renotify: true,
  requireInteraction: true,
  data: { machineId: 'W01', timeRemaining: 0 }
}
```

## Image Notification

Notification with an image (if supported):

```javascript
{
  title: '📷 New Floorplan Available',
  body: 'Check out the updated laundry room layout',
  icon: '/icons/android-chrome-192x192.png',
  image: '/screenshot.png',
  badge: '/icons/android-chrome-192x192.png',
  data: {
    url: '/',
    type: 'floorplan-update'
  }
}
```

## Sending from Service Worker

Example of sending any of these notifications from your Service Worker:

```javascript
// In service-worker.js
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Default Title',
    body: 'Default body',
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png'
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData
    )
  );
});
```

## Sending from Server

Example using `web-push` library:

```javascript
const webpush = require('web-push');

// Configure VAPID
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Get subscription from database
const subscription = getUserSubscription(userId);

// Choose a notification type from above
const payload = JSON.stringify({
  title: '🎉 Washer Ready!',
  body: 'Washer W01 has completed its cycle',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  vibrate: [200, 100, 200],
  tag: 'machine-w01-complete',
  requireInteraction: true,
  data: {
    url: '/',
    machineId: 'W01',
    type: 'machine-complete'
  },
  actions: [
    { action: 'view', title: 'View Machine' },
    { action: 'dismiss', title: 'Dismiss' }
  ]
});

// Send notification
webpush.sendNotification(subscription, payload)
  .then(response => {
    console.log('✅ Notification sent successfully');
  })
  .catch(error => {
    console.error('❌ Error sending notification:', error);
    
    // Handle errors (expired subscription, etc.)
    if (error.statusCode === 410) {
      // Subscription expired, remove from database
      removeSubscription(userId);
    }
  });
```

## Notification Options Reference

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | The notification title (required) |
| `body` | string | The notification body text |
| `icon` | string | URL to notification icon |
| `badge` | string | URL to badge icon (shown in notification tray) |
| `image` | string | URL to large image |
| `vibrate` | number[] | Vibration pattern [ms on, ms off, ...] |
| `tag` | string | Unique ID (same tag replaces previous notification) |
| `renotify` | boolean | Re-alert even if same tag |
| `requireInteraction` | boolean | Keep notification until user interacts |
| `silent` | boolean | Don't play sound or vibrate |
| `timestamp` | number | Timestamp (ms since epoch) |
| `data` | object | Custom data attached to notification |
| `actions` | array | Action buttons |
| `dir` | string | Text direction ('ltr', 'rtl', 'auto') |
| `lang` | string | Language code |

## Action Button Format

```javascript
{
  action: 'unique-action-id',  // Used to identify which button was clicked
  title: 'Button Text',        // Text shown on button
  icon: '/path/to/icon.png'    // Optional icon (not widely supported)
}
```

## Best Practices

### Do's ✅

- **Use clear, concise titles** - Users scan quickly
- **Include emojis** for visual appeal (🎉, ⏰, ✨)
- **Add vibration patterns** for tactile feedback
- **Use tags** to prevent notification spam
- **Provide actions** for common responses
- **Include data** for custom click handling
- **Set appropriate icons** for brand consistency
- **Use requireInteraction** for important notifications

### Don'ts ❌

- **Don't spam** - Respect user attention
- **Don't send silent notifications** excessively
- **Don't use misleading titles** or clickbait
- **Don't include sensitive information** in notifications
- **Don't forget fallback text** if rich features fail
- **Don't make notifications too long**

## Testing Notifications

Test any notification example:

```javascript
// In browser console
navigator.serviceWorker.ready.then(reg => {
  reg.showNotification('Test Title', {
    // Paste any example from above
    body: 'Test body',
    icon: '/icons/android-chrome-192x192.png'
  });
});
```

## Custom Notification Types

Create your own notification types based on your app's needs:

```javascript
// notification-types.js
export const NotificationTypes = {
  MACHINE_COMPLETE: 'machine-complete',
  MACHINE_AVAILABLE: 'machine-available',
  MACHINE_FINISHING: 'machine-finishing',
  MAINTENANCE: 'maintenance',
  REMINDER: 'reminder',
  ALL_BUSY: 'all-busy',
  SYNC: 'sync'
};

export function createNotification(type, data) {
  const templates = {
    [NotificationTypes.MACHINE_COMPLETE]: {
      title: '🎉 Machine Ready!',
      body: `${data.machineId} has completed its cycle`,
      tag: `${data.machineId}-complete`,
      requireInteraction: true
    },
    // ... other templates
  };
  
  return {
    ...templates[type],
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
    data: { ...data, type }
  };
}
```

## Resources

- [Notification API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
- [Push API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Notification Options](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification)
- [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

---

**Pro Tip:** Start with simple notifications and add features gradually. Test on multiple devices and browsers to ensure compatibility!

