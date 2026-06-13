import webpush from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:support@pokefun.in',
    vapidPublicKey,
    vapidPrivateKey
  );
} else {
  console.warn("VAPID keys are missing. Web Push notifications will not work.");
}

export async function sendPushNotification(subscription: any, payload: any) {
  if (!vapidPublicKey || !vapidPrivateKey) return;
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    // If subscription is invalid/expired (410), we could potentially remove it here.
  }
}
