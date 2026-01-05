"use client"

import { useState, useEffect } from "react"

export function usePushNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>("default")
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission)
        }

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
                reg.pushManager.getSubscription().then((sub) => {
                    setSubscription(sub)
                })
            })
        }
    }, [])

    const subscribe = async () => {
        if (!("serviceWorker" in navigator)) return

        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "YOUR_PUBLIC_VAPID_KEY_HERE" // This needs to be generated
        })

        setSubscription(sub)
        // Here you would send the subscription to your backend
        return sub
    }

    return { permission, subscription, subscribe }
}
