"use client"

import * as React from "react"
import { Check, Clock, Fingerprint, MapPin, Scan, ShieldCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  type: "in" | "out"
}

export function AttendanceModal({ isOpen, onClose, type }: AttendanceModalProps) {
  const { toast } = useToast()
  const [step, setStep] = React.useState<"details" | "verifying" | "success">("details")
  const [workMode, setWorkMode] = React.useState("on-site")
  const [location, setLocation] = React.useState("Headquarters - Main Office")

  const handleVerify = () => {
    setStep("verifying")
    // Simulate biometric verification (Face ID/WebAuthn)
    setTimeout(() => {
      setStep("success")
      toast({
        title: type === "in" ? "Checked In Successfully" : "Checked Out Successfully",
        description: `Verified via Biometrics at ${new Date().toLocaleTimeString()}`,
      })
    }, 2500)
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => setStep("details"), 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-background rounded-[2.5rem]">
        <div className="relative">
          {/* Header Visual */}
          <div className="h-32 bg-secondary/20 flex items-center justify-center border-b border-border/20">
            <div
              className={cn(
                "size-16 rounded-3xl flex items-center justify-center transition-all duration-500",
                step === "verifying"
                  ? "animate-pulse bg-primary/10"
                  : "bg-background shadow-sm border border-border/30",
              )}
            >
              {step === "details" && <ShieldCheck className="size-8 text-muted-foreground" />}
              {step === "verifying" && <Scan className="size-8 text-primary animate-in zoom-in duration-300" />}
              {step === "success" && <Check className="size-8 text-green-600 animate-in zoom-in duration-300" />}
            </div>
          </div>

          <div className="p-8 space-y-6">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-3xl font-serif">
                {step === "details" && (type === "in" ? "Check In" : "Check Out")}
                {step === "verifying" && "Verifying Presence"}
                {step === "success" && "Verified"}
              </DialogTitle>
              <DialogDescription className="text-base font-light">
                {step === "details" && "Confirm your location and work mode to proceed with biometric verification."}
                {step === "verifying" && "Position your face within the frame or provide your biometric signature."}
                {step === "success" && `Successfully ${type === "in" ? "checked in" : "checked out"} for today.`}
              </DialogDescription>
            </DialogHeader>

            {step === "details" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                      Work Mode
                    </Label>
                    <Select value={workMode} onValueChange={setWorkMode}>
                      <SelectTrigger className="w-full h-12 rounded-xl border-border/30 bg-secondary/10">
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                      Current Location
                    </Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full h-12 rounded-xl border border-border/30 bg-secondary/10 pl-12 pr-4 text-sm font-medium outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/20 flex gap-4 items-center">
                  <div className="size-10 rounded-xl bg-background flex items-center justify-center border border-border/30">
                    <Clock className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Current Time</p>
                    <p className="text-lg font-serif">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-background text-[10px] tracking-tight py-0">
                    UTC +1
                  </Badge>
                </div>
              </div>
            )}

            {step === "verifying" && (
              <div className="py-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                  <div className="size-48 rounded-[3rem] border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden bg-secondary/10">
                    <Fingerprint className="size-20 text-primary/40 animate-pulse" />
                  </div>
                  {/* Scanning Line Animation */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 rounded-full animate-scan shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary animate-pulse">
                  Biometric Scan in progress
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="py-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/20 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Mode</p>
                    <p className="text-sm font-medium capitalize">{workMode}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/20 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Status</p>
                    <p className="text-sm font-medium text-green-600">Verified</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl text-lg font-serif bg-transparent"
                  onClick={resetAndClose}
                >
                  Back to Dashboard
                </Button>
              </div>
            )}

            {step === "details" && (
              <DialogFooter className="flex-col sm:flex-col gap-3">
                <Button size="lg" className="w-full h-14 rounded-2xl text-lg font-serif group" onClick={handleVerify}>
                  Confirm & Verify
                  <Fingerprint className="ml-2 size-5 group-hover:scale-110 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground font-light hover:bg-transparent"
                  onClick={resetAndClose}
                >
                  Cancel
                </Button>
              </DialogFooter>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
