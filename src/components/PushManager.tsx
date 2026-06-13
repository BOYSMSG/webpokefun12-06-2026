"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/Toast";

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
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

export default function PushManager() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    
    // Listen for in-app messages from the Service Worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        const payload = event.data.payload;
        addToast(`${payload.title}: ${payload.message}`, 'info');
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [session, addToast]);

  useEffect(() => {
    if (!session?.user) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const registerAndSubscribe = async () => {
      try {
        // Register Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Wait for it to be active
        if (registration.installing) {
          await new Promise((resolve) => {
            registration.installing?.addEventListener('statechange', (e) => {
              if ((e.target as ServiceWorker).state === 'activated') {
                resolve(null);
              }
            });
          });
        }

        // Ask for permission if not already granted or denied
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') return;
        } else if (Notification.permission === 'denied') {
          return;
        }

        // Check existing subscription
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (!vapidPublicKey) {
            console.error("VAPID public key not found");
            return;
          }
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        }

        // Send to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription })
        });
        
        setIsSubscribed(true);
      } catch (error) {
        console.error("Push registration failed:", error);
      }
    };

    registerAndSubscribe();
  }, [session]);

  return null; // This is a headless component that just manages push logic
}
