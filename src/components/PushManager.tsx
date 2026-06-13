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
  const toastObj = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    
    // Listen for in-app messages from the Service Worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        const payload = event.data.payload;
        
        const activeWindow = (window as any).__activeWidgetWindow;
        const isMsg = payload.title?.toLowerCase().includes('message') || payload.title?.toLowerCase().includes('reply');
        
        let shouldSuppress = false;
        if (isMsg) {
          const urlParams = new URLSearchParams(window.location.search);
          const activeContact = urlParams.get('user');
          if (window.location.pathname.includes('/messages') && activeContact && payload.title.includes(`@${activeContact}`)) {
            shouldSuppress = true;
          } else if (activeWindow === 'messages') {
            shouldSuppress = true;
          }
        }

        if (!shouldSuppress) {
          toastObj.info(`${payload.title}: ${payload.message}`, payload.url);
          
          // Play Sound if not muted
          if (localStorage.getItem('muteMsgSound') !== 'true') {
             try {
               const audio = new Audio('/audio/notification.wav');
               audio.play().catch(() => {});
             } catch (err) {}
          }
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [session]);

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

  useEffect(() => {
    if (!session?.user) return;
    
    // Fallback polling for unread messages and Toasts
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/messages/unread');
        const data = await res.json();
        
        if (data.count !== undefined) {
           const prevCount = parseInt(window.sessionStorage.getItem('lastUnreadCount') || '0');
           if (data.count > prevCount && localStorage.getItem('muteMsgSound') !== 'true') {
              // Show Toast popup!
              if (data.latestMessage) {
                 toastObj.info(`New Message from @${data.latestMessage.senderId}: ${data.latestMessage.content}`, `/messages?user=${data.latestMessage.senderId}`);
              }

              // Play Sound
              if ((window as any).__activeWidgetWindow !== 'messages' && !window.location.pathname.includes('/messages')) {
                try {
                  const audio = new Audio('/audio/notification.wav');
                  audio.play().catch(() => {});
                } catch(e) {}
              }
           }
           window.sessionStorage.setItem('lastUnreadCount', data.count.toString());
        }

        // Update badges
        ['desktop-nav-messages', 'mobile-nav-messages'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            let badge = el.querySelector('.unread-badge');
            if (data.count > 0 && window.location.pathname !== '/messages') {
              if (!badge) {
                badge = document.createElement('span');
                badge.className = 'unread-badge';
                badge.style.cssText = 'position: absolute; top: -5px; right: -24px; background: red; color: white; border-radius: 12px; padding: 3px 7px; font-size: 0.75rem; font-weight: bold; line-height: 1; text-align: center; min-width: 18px; box-sizing: border-box;';
                el.appendChild(badge);
              }
              badge.textContent = data.count > 9 ? '9+' : data.count.toString();
            } else if (badge) {
              badge.remove();
            }
          }
        });
      } catch (e) {}
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  return null; // This is a headless component that just manages push logic
}
