"use client"

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function usePushNotifications() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    setRegistration(reg);
                    return reg.pushManager.getSubscription();
                })
                .then(sub => {
                    setSubscription(sub);
                    setIsSubscribed(!!sub);
                })
                .catch(err => console.error('SW registration failed:', err));
        }
    }, []);

    const subscribe = useCallback(async () => {
        if (!registration) {
            toast.error('Service worker not ready');
            return;
        }

        if (!VAPID_PUBLIC_KEY) {
            console.error('VAPID public key missing');
            return;
        }

        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            const res = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });

            if (res.ok) {
                setSubscription(sub);
                setIsSubscribed(true);
                toast.success('Successfully subscribed to notifications');
            } else {
                throw new Error('Failed to save subscription');
            }
        } catch (err) {
            console.error('Subscription failed:', err);
            toast.error('Failed to subscribe to notifications');
        }
    }, [registration]);

    return { isSubscribed, subscribe, subscription };
}

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
