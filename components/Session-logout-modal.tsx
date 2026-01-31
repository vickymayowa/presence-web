"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

interface SessionLogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason?: string
}

export default function SessionLogoutModal({ open, onOpenChange, reason }: SessionLogoutModalProps) {
  const router = useRouter()

  const handleConfirm = () => {
    onOpenChange(false)
    router.push("/")
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-border/40 rounded-2rem shadow-lg">
        <div className="flex items-center justify-center mb-2">
          <div className="p-3 rounded-full bg-destructive/10">
            <LogOut className="w-6 h-6 text-destructive" />
          </div>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-center font-serif text-2xl">Session Ended</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground/80 mt-2">
            {reason || "Your session has ended. Please log in again to continue."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/30 rounded-xl p-4 my-2">
          <p className="text-sm text-foreground/70">
            For security purposes, you were automatically logged out. This may happen if you log in from another device
            or if your session expires.
          </p>
        </div>

        <AlertDialogAction
          onClick={handleConfirm}
          className="bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-300 h-11 text-base"
        >
          Return to Home
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}
