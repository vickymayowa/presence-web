"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut, AlertCircle } from "lucide-react"

interface LogoutModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  description?: string
  reason?: "session-conflict" | "inactivity" | "manual"
}

export function LogoutModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Session Ended",
  description = "You were logged out because another device signed in.",
  reason = "session-conflict",
}: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="bg-background border border-border/40 rounded-[2.5rem] p-10 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <DialogHeader className="space-y-6 text-center">
          {/* Icon Container */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>

          {/* Title - Using serif font for premium feel */}
          <DialogTitle className="text-3xl font-serif text-foreground">{title}</DialogTitle>

          {/* Description */}
          <DialogDescription className="text-base text-muted-foreground leading-relaxed font-light">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Additional Info based on reason */}
        <div className="bg-secondary/30 border border-border/40 rounded-xl p-5 text-center">
          <p className="text-sm text-muted-foreground font-light">
            {reason === "session-conflict" && "Your account was accessed from another location."}
            {reason === "inactivity" && "Your session has expired due to inactivity."}
            {reason === "manual" && "You have been successfully logged out."}
          </p>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-full border-border/40 hover:bg-secondary/50 text-foreground font-semibold bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Sign In Again
          </Button>
        </DialogFooter>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground/60 font-light uppercase tracking-wider">
          Your data is secure and encrypted
        </p>
      </DialogContent>
    </Dialog>
  )
}
