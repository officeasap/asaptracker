
interface SubscriptionData {
  name: string;
  email: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
}

// Check if the browser supports service workers and push notifications
export const isPushNotificationSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Ask the user for permission to send push notifications
export const askForNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications are not supported in this browser');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      await registerServiceWorker();
    }
    
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Register the service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

// Create a push subscription
export const createPushSubscription = async (): Promise<PushSubscription | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Get the push subscription from the service worker
    let subscription = await registration.pushManager.getSubscription();
    
    // If there's no subscription, create one
    if (!subscription) {
      const vapidPublicKey = 'BDzM2jH_SoJVkzwjKLygAO8NcL8Ey5T9aNB6umVjJ_9N-p6WGTl3FcRFW1-lrNgvIFR3kmO2FZrWrZZzLCNY6lA';
      
      // Convert the public key to a Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
      
      console.log('Created new push subscription:', subscription);
    } else {
      console.log('Using existing push subscription:', subscription);
    }
    
    return subscription;
  } catch (error) {
    console.error('Error creating push subscription:', error);
    return null;
  }
};

// Subscribe the user to push notifications
export const subscribeUserToPushNotifications = async (userData: SubscriptionData): Promise<boolean> => {
  try {
    // First, check permission
    if (Notification.permission !== 'granted') {
      const permission = await askForNotificationPermission();
      if (permission !== 'granted') {
        return false;
      }
    }
    
    // Register service worker and create subscription
    await registerServiceWorker();
    const subscription = await createPushSubscription();
    
    if (!subscription) {
      return false;
    }
    
    // Here you would send the subscription to your server
    // For now, we'll just log it and simulate a successful subscription
    console.log('Push subscription data:', {
      userData,
      subscription
    });
    
    // Send the subscription to a hypothetical server endpoint
    // In a real application, you'd send this to your backend API
    // This is where you'd integrate with your backend service
    /*
    const response = await fetch('/api/push-subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        userData
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save subscription on server');
    }
    */
    
    // Store subscription info in localStorage for demo purposes
    // In a real app, this would be handled by your server
    const subscriptions = JSON.parse(localStorage.getItem('pushSubscriptions') || '[]');
    subscriptions.push({
      id: Date.now().toString(),
      userData,
      subscription: subscription.toJSON(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('pushSubscriptions', JSON.stringify(subscriptions));
    
    return true;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
};

// Send a test notification
export const sendTestNotification = (): void => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Test Notification', {
      body: 'This is a test notification from ASAP Tracker',
      icon: '/favicon.ico'
    });
    
    notification.onclick = () => {
      console.log('Notification clicked');
      window.focus();
      notification.close();
    };
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      // Here you would also inform your server about the unsubscription
      // For demo purposes, we'll update localStorage
      const subscriptions = JSON.parse(localStorage.getItem('pushSubscriptions') || '[]');
      localStorage.setItem('pushSubscriptions', JSON.stringify(
        subscriptions.filter((sub: any) => {
          // This is a simplified comparison that may not work in all cases
          return JSON.stringify(sub.subscription.endpoint) !== JSON.stringify(subscription.endpoint);
        })
      ));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
};

// Check if the user is subscribed to push notifications
export const checkSubscription = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    return !!subscription;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
};

// Utility function to convert a base64 string to a Uint8Array
// This is needed for the applicationServerKey
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
