"use client"

import NextjsProgressBar from 'nextjs-progressbar'

export function ProgressBar() {
    return (
        <NextjsProgressBar
            color="oklch(0.2 0 0)"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
            options={{ showSpinner: false }}
        />
    )
}
