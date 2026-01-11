"use client"

import * as React from "react"
import { Check, Clock, MapPin, Scan, ShieldCheck, Loader2 } from "lucide-react"
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
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [stream, setStream] = React.useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const handleVerify = async () => {
    setStep("verifying")
    await startCamera()

    // Simulate biometric verification (Face ID)
    setTimeout(() => {
      setStep("success")
      stopCamera()
    }, 7000)
  }

  const resetAndClose = () => {
    stopCamera()
    onClose()
    setTimeout(() => setStep("details"), 300)
  }

  React.useEffect(() => {
    return () => stopCamera()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-background rounded-[2.5rem] shadow-2xl">
        <div className="relative">
          {/* Header Visual */}
          <div className="h-32 bg-secondary/20 flex items-center justify-center border-b border-border/20 transition-all duration-700">
            <div
              className={cn(
                "size-16 rounded-3xl flex items-center justify-center transition-all duration-500",
                step === "verifying" ? "bg-primary/10 scale-110" : "bg-background shadow-sm border border-border/30",
              )}
            >
              {step === "details" && <ShieldCheck className="size-8 text-muted-foreground" />}
              {step === "verifying" && <Scan className="size-8 text-primary animate-pulse" />}
              {step === "success" && (
                <div className="size-16 rounded-3xl bg-green-500 flex items-center justify-center animate-in zoom-in duration-500">
                  <Check className="size-8 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="p-8 space-y-6">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-3xl font-serif">
                {step === "details" && (type === "in" ? "Check In" : "Check Out")}
                {step === "verifying" && "Biometric Identity"}
                {step === "success" && "Identity Verified"}
              </DialogTitle>
              <DialogDescription className="text-base font-light">
                {step === "details" && "Confirm your location and work mode to proceed with face verification."}
                {step === "verifying" && "Scanning face. Please hold still and look at the camera."}
                {step === "success" && `Welcome, you've successfully ${type === "in" ? "checked in" : "checked out"}.`}
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
                    Active Session
                  </Badge>
                </div>
              </div>
            )}

            {step === "verifying" && (
              <div className="py-2 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
                <div className="relative">
                  {/* Background blur effect for depth */}
                  <div className="absolute -inset-8 bg-black/5 backdrop-blur-sm rounded-[3.5rem] -z-10" />

                  {/* Camera frame with pop animation */}
                  <div className="relative size-64 overflow-hidden rounded-[3rem] border-2 border-primary/20 bg-black group animate-in zoom-in-50 duration-500 shadow-2xl shadow-primary/30">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* Face ID Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Corner Borders */}
                      <div className="absolute top-8 left-8 size-12 border-t-2 border-l-2 border-primary/60 rounded-tl-2xl" />
                      <div className="absolute top-8 right-8 size-12 border-t-2 border-r-2 border-primary/60 rounded-tr-2xl" />
                      <div className="absolute bottom-8 left-8 size-12 border-b-2 border-l-2 border-primary/60 rounded-bl-2xl" />
                      <div className="absolute bottom-8 right-8 size-12 border-b-2 border-r-2 border-primary/60 rounded-br-2xl" />

                      {/* Scanning Line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-[0_0_15px_rgba(var(--primary),0.8)]" />

                      {/* Detection Points */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 border border-white/10 rounded-full animate-ping" />
                    </div>

                    {!stream && (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm">
                        <Loader2 className="size-8 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary animate-pulse">
                    Analyzing Facial Biometrics
                  </p>
                  <div className="flex gap-1">
                    <div className="size-1 rounded-full bg-primary/20 animate-bounce [animation-delay:-0.3s]" />
                    <div className="size-1 rounded-full bg-primary/20 animate-bounce [animation-delay:-0.15s]" />
                    <div className="size-1 rounded-full bg-primary/20 animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="py-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="p-6 rounded-3xl bg-secondary/10 border border-border/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Verified Identity
                      </p>
                      <p className="text-lg font-medium">Lukas Mitchell</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 rounded-lg">
                      High Confidence
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Check-in Time
                      </p>
                      <p className="text-sm font-medium">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Location
                      </p>
                      <p className="text-sm font-medium truncate">{location}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full h-14 rounded-2xl text-lg font-serif" onClick={resetAndClose}>
                  Continue to Feed
                </Button>
              </div>
            )}

            {step === "details" && (
              <DialogFooter className="flex-col sm:flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full h-14 rounded-2xl text-lg font-serif group shadow-xl shadow-primary/20"
                  onClick={handleVerify}
                >
                  Face ID Check-in
                  <Scan className="ml-2 size-5 group-hover:scale-110 transition-transform" />
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
