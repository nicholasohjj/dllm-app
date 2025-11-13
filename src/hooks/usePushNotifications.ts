import { useState, useEffect, useCallback } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
}

interface UsePushNotificationsReturn extends PushNotificationState {
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
  sendTestNotification: () => void;
}

// Utility function to convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    subscription: null,
    permission: 'default',
    isLoading: true,
    error: null,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported =
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window;

      if (!isSupported) {
        setState((prev) => ({
          ...prev,
          isSupported: false,
          isLoading: false,
          error: 'Push notifications are not supported in this browser.',
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission,
      }));

      // Check if already subscribed
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        setState((prev) => ({
          ...prev,
          isSubscribed: !!subscription,
          subscription: subscription,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error checking subscription:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check subscription status.',
        }));
      }
    };

    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    setState((prev) => ({ ...prev, permission }));
    return permission;
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request permission if not granted
      if (Notification.permission !== 'granted') {
        const permission = await requestPermission();
        if (permission !== 'granted') {
          throw new Error('Notification permission denied');
        }
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from environment variable
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        throw new Error('VAPID public key is not configured. Please set VITE_VAPID_PUBLIC_KEY in your .env file.');
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send subscription to server
      await sendSubscriptionToServer(subscription);

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        subscription,
        isLoading: false,
      }));

      console.log('Successfully subscribed to push notifications');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to push notifications';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [requestPermission]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe
        await subscription.unsubscribe();

        // Notify server
        await sendUnsubscriptionToServer(subscription);

        setState((prev) => ({
          ...prev,
          isSubscribed: false,
          subscription: null,
          isLoading: false,
        }));

        console.log('Successfully unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to unsubscribe from push notifications';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Send a test notification (for development/testing)
  const sendTestNotification = useCallback(() => {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('DLLM Laundry Monitor', {
          body: 'This is a test notification!',
          icon: '/icons/android-chrome-192x192.png',
          badge: '/icons/android-chrome-192x192.png',
          vibrate: [200, 100, 200],
          tag: 'test-notification',
          data: {
            url: '/',
          },
        });
      });
    }
  }, []);

  return {
    ...state,
    subscribe,
    unsubscribe,
    requestPermission,
    sendTestNotification,
  };
}

// Helper function to send subscription to server
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }

    console.log('Subscription sent to server successfully');
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    // Don't throw - we still want to maintain local subscription
  }
}

// Helper function to send unsubscription to server
async function sendUnsubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    const response = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('Failed to send unsubscription to server');
    }

    console.log('Unsubscription sent to server successfully');
  } catch (error) {
    console.error('Error sending unsubscription to server:', error);
    // Don't throw - we still want to maintain local unsubscription
  }
}

