"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Clock, MapPin, Zap } from "lucide-react"
import { AttendanceModal } from "@/components/attendance-modal"
import * as React from "react"

export default function DashboardPage() {
  const [attendanceModal, setAttendanceModal] = React.useState<{ isOpen: boolean; type: "in" | "out" }>({
    isOpen: false,
    type: "in",
  })
const SITE_ENABLED = false;

if (!SITE_ENABLED) {
  window.location.href = "/";
  return null;
}


  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
          Welcome back, <span className="text-muted-foreground/40 italic">John.</span>
        </h2>
        <p className="text-lg text-muted-foreground font-light max-w-2xl">
          Your attendance is tracked and verified. You have completed 85% of your hybrid work requirements this month.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Status", value: "Checked In", sub: "9:05 AM", icon: Clock, color: "text-green-600" },
          { label: "Work Mode", value: "Hybrid", sub: "Office Day", icon: MapPin, color: "text-blue-600" },
          { label: "Monthly Score", value: "94/100", sub: "Excellent", icon: Zap, color: "text-purple-600" },
          {
            label: "Pending Requests",
            value: "2",
            sub: "Leave/Overtime",
            icon: ArrowUpRight,
            color: "text-orange-600",
          },
        ].map((stat) => (
          <Card key={stat.label} className="bg-secondary/20 border-border/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="font-bold uppercase tracking-widest text-[10px]">
                  {stat.label}
                </CardDescription>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
              <CardTitle className="text-2xl font-serif mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-light">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/30 overflow-hidden">
          <CardHeader className="border-b bg-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-serif">Quick Actions</CardTitle>
                <CardDescription>Verified attendance actions via Biometrics</CardDescription>
              </div>
              <Badge variant="outline" className="font-bold uppercase tracking-widest text-[10px]">
                Secured
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="flex-1 h-24 rounded-2xl flex flex-col items-start p-6 gap-2 bg-primary text-primary-foreground group"
                onClick={() => setAttendanceModal({ isOpen: true, type: "out" })}
              >
                <div className="flex items-center justify-between w-full">
                  <Clock className="size-5 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="size-4 opacity-40" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold block">Check Out</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Requires Face ID</span>
                </div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-24 rounded-2xl flex flex-col items-start p-6 gap-2 border-border/40 hover:bg-secondary/50 bg-transparent group"
              >
                <div className="flex items-center justify-between w-full text-muted-foreground">
                  <MapPin className="size-5 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="size-4 opacity-40" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold block">Switch Mode</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Current: On-site</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Today's Schedule</CardTitle>
            <CardDescription>Hybrid Office Day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "09:00 AM", event: "Morning Sync", type: "Remote" },
              { time: "11:30 AM", event: "Design Review", type: "On-site" },
              { time: "02:00 PM", event: "Staff All-hands", type: "On-site" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 w-16 pt-1">
                  {item.time}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.event}</p>
                  <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-tighter px-1.5 py-0">
                    {item.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <AttendanceModal
        isOpen={attendanceModal.isOpen}
        onClose={() => setAttendanceModal({ ...attendanceModal, isOpen: false })}
        type={attendanceModal.type}
      />
    </div>
  )
}
