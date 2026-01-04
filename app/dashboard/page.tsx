"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Zap,
  Users,
  TrendingUp,
  Building2,
  UserCheck,
  Calendar,
  FileText,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { AttendanceModal } from "@/components/attendance-modal"
import { useAuth } from "@/lib/auth-context"
import {
  companyStats,
  attendanceRecords,
  leaveRequests,
  users,
  getUsersByManager,
  getUserById
} from "@/lib/mock-data"

export default function DashboardPage() {
  const { user } = useAuth()
  const [attendanceModal, setAttendanceModal] = React.useState<{ isOpen: boolean; type: "in" | "out" }>({
    isOpen: false,
    type: "in",
  })

  if (!user) return null

  // Get today's attendance for current user
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendanceRecords.find(r => r.userId === user.id && r.date === today)
  const isCheckedIn = todayAttendance?.checkIn && !todayAttendance?.checkOut

  // Render different dashboards based on role
  const renderDashboard = () => {
    switch (user.role) {
      case 'ceo':
        return <CEODashboard />
      case 'hr':
        return <HRDashboard />
      case 'manager':
        return <ManagerDashboard userId={user.id} />
      default:
        return (
          <StaffDashboard
            user={user}
            todayAttendance={todayAttendance}
            isCheckedIn={isCheckedIn}
            onCheckAction={(type) => setAttendanceModal({ isOpen: true, type })}
          />
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-3">
        <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
          Welcome back,{" "}
          <span className="text-muted-foreground/40 italic">{user.firstName}.</span>
        </h2>
        <p className="text-lg text-muted-foreground font-light max-w-2xl">
          {user.role === 'ceo' && "Your executive dashboard shows company-wide attendance and performance."}
          {user.role === 'hr' && "Manage employee attendance, leaves, and ensure compliance across departments."}
          {user.role === 'manager' && "Track your team's attendance and manage pending approval requests."}
          {user.role === 'staff' && "Your attendance is tracked and verified. Check in to start your day."}
        </p>
      </div>

      {renderDashboard()}

      <AttendanceModal
        isOpen={attendanceModal.isOpen}
        onClose={() => setAttendanceModal({ ...attendanceModal, isOpen: false })}
        type={attendanceModal.type}
      />
    </div>
  )
}

// Staff Dashboard Component
function StaffDashboard({
  user,
  todayAttendance,
  isCheckedIn,
  onCheckAction
}: {
  user: any
  todayAttendance: any
  isCheckedIn: boolean
  onCheckAction: (type: 'in' | 'out') => void
}) {
  const myLeaveRequests = leaveRequests.filter(r => r.userId === user.id)
  const pendingRequests = myLeaveRequests.filter(r => r.status === 'pending').length

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Today's Status"
          value={isCheckedIn ? "Checked In" : todayAttendance?.checkOut ? "Checked Out" : "Not Checked In"}
          sub={todayAttendance?.checkIn || "—"}
          icon={Clock}
          color={isCheckedIn ? "text-green-600" : "text-muted-foreground"}
        />
        <StatCard
          label="Work Mode"
          value={todayAttendance?.workMode ? capitalize(todayAttendance.workMode) : "—"}
          sub={todayAttendance?.workMode === 'office' ? "On-site" : "Remote Work"}
          icon={MapPin}
          color="text-blue-600"
        />
        <StatCard
          label="Monthly Score"
          value="94/100"
          sub="Excellent"
          icon={Zap}
          color="text-purple-600"
        />
        <StatCard
          label="Pending Requests"
          value={pendingRequests.toString()}
          sub="Leave/Overtime"
          icon={ArrowUpRight}
          color="text-orange-600"
        />
      </div>

      {/* Quick Actions & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className={`flex-1 h-24 rounded-2xl flex flex-col items-start p-6 gap-2 group ${isCheckedIn
                    ? "bg-primary text-primary-foreground"
                    : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                onClick={() => onCheckAction(isCheckedIn ? "out" : "in")}
              >
                <div className="flex items-center justify-between w-full">
                  <Clock className="size-5 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="size-4 opacity-40" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold block">
                    {isCheckedIn ? "Check Out" : "Check In"}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                    Requires Face ID
                  </span>
                </div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-24 rounded-2xl flex flex-col items-start p-6 gap-2 border-border/40 hover:bg-secondary/50 bg-transparent group"
              >
                <div className="flex items-center justify-between w-full text-muted-foreground">
                  <FileText className="size-5 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="size-4 opacity-40" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold block">Request Leave</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                    Annual / Sick / WFH
                  </span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Today's Schedule</CardTitle>
            <CardDescription>Your planned activities</CardDescription>
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
    </>
  )
}

// CEO Dashboard Component
function CEODashboard() {
  return (
    <>
      {/* Company Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Employees"
          value={companyStats.totalEmployees.toString()}
          sub="Active workforce"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          label="Present Today"
          value={companyStats.presentToday.toString()}
          sub={`${Math.round((companyStats.presentToday / companyStats.totalEmployees) * 100)}% attendance`}
          icon={UserCheck}
          color="text-green-600"
        />
        <StatCard
          label="On Leave"
          value={companyStats.onLeave.toString()}
          sub="Approved absences"
          icon={Calendar}
          color="text-orange-600"
        />
        <StatCard
          label="Avg Attendance"
          value={`${companyStats.averageAttendance}%`}
          sub="Monthly average"
          icon={TrendingUp}
          color="text-purple-600"
        />
      </div>

      {/* Department Overview & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/30">
          <CardHeader className="border-b bg-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-serif">Department Overview</CardTitle>
                <CardDescription>Real-time attendance by department</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {[
              { name: "Engineering", present: 3, total: 4, percentage: 75 },
              { name: "Marketing", present: 2, total: 3, percentage: 67 },
              { name: "Human Resources", present: 2, total: 2, percentage: 100 },
              { name: "Executive", present: 1, total: 1, percentage: 100 },
            ].map((dept, i) => (
              <div
                key={dept.name}
                className={`flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors ${i !== 3 ? "border-b border-border/30" : ""
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dept.present} of {dept.total} present
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{dept.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Quick Stats</CardTitle>
            <CardDescription>Company performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-background border border-border/30">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                Pending Approvals
              </p>
              <p className="text-3xl font-serif">{companyStats.pendingRequests}</p>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border/30">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                Remote Workers
              </p>
              <p className="text-3xl font-serif">{companyStats.remote}</p>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border/30">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                Uptime SLA
              </p>
              <p className="text-3xl font-serif">99.9%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// HR Dashboard Component
function HRDashboard() {
  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending')

  return (
    <>
      {/* HR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Employees"
          value={users.length.toString()}
          sub="Across all departments"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          label="Present Today"
          value={companyStats.presentToday.toString()}
          sub="Currently working"
          icon={UserCheck}
          color="text-green-600"
        />
        <StatCard
          label="Leave Requests"
          value={pendingLeaves.length.toString()}
          sub="Pending approval"
          icon={FileText}
          color="text-orange-600"
        />
        <StatCard
          label="Compliance Score"
          value="98%"
          sub="All requirements met"
          icon={Zap}
          color="text-purple-600"
        />
      </div>

      {/* Pending Approvals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/30">
          <CardHeader className="border-b bg-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif">Pending Leave Requests</CardTitle>
                <CardDescription>Requires your attention</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {pendingLeaves.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {pendingLeaves.slice(0, 4).map((request, i) => {
              const requestUser = getUserById(request.userId)
              return (
                <div
                  key={request.id}
                  className={`flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors ${i !== pendingLeaves.length - 1 ? "border-b border-border/30" : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs">
                        {requestUser?.firstName[0]}{requestUser?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {requestUser?.firstName} {requestUser?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {capitalize(request.type)} • {request.startDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="size-8 p-0 text-green-600">
                      <CheckCircle2 className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="size-8 p-0 text-destructive">
                      <XCircle className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="border-b bg-secondary/10">
            <CardTitle className="text-xl font-serif">Attendance Alerts</CardTitle>
            <CardDescription>Today's notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[
              { type: "late", message: "Alex Johnson checked in 30 minutes late", time: "9:30 AM" },
              { type: "leave", message: "Lisa Park is on approved leave today", time: "—" },
              { type: "info", message: "Monthly attendance report ready", time: "8:00 AM" },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                <div className={`mt-0.5 ${alert.type === 'late' ? 'text-orange-500' :
                    alert.type === 'leave' ? 'text-blue-500' : 'text-muted-foreground'
                  }`}>
                  <AlertCircle className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Manager Dashboard Component
function ManagerDashboard({ userId }: { userId: string }) {
  const teamMembers = getUsersByManager(userId)
  const teamAttendance = attendanceRecords.filter(r =>
    teamMembers.some(m => m.id === r.userId) &&
    r.date === new Date().toISOString().split('T')[0]
  )
  const presentCount = teamAttendance.filter(r => r.status === 'present' || r.status === 'late').length
  const pendingApprovals = leaveRequests.filter(r =>
    r.status === 'pending' && teamMembers.some(m => m.id === r.userId)
  )

  return (
    <>
      {/* Manager Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Team Size"
          value={teamMembers.length.toString()}
          sub="Direct reports"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          label="Present Today"
          value={presentCount.toString()}
          sub={`${Math.round((presentCount / teamMembers.length) * 100)}% of team`}
          icon={UserCheck}
          color="text-green-600"
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovals.length.toString()}
          sub="Needs attention"
          icon={FileText}
          color="text-orange-600"
        />
        <StatCard
          label="Team Performance"
          value="92%"
          sub="Monthly avg"
          icon={TrendingUp}
          color="text-purple-600"
        />
      </div>

      {/* Team Status & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/30">
          <CardHeader className="border-b bg-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif">Team Status</CardTitle>
                <CardDescription>Today's attendance</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {teamMembers.map((member, i) => {
              const attendance = teamAttendance.find(a => a.userId === member.id)
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors ${i !== teamMembers.length - 1 ? "border-b border-border/30" : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs">
                        {member.firstName[0]}{member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.firstName} {member.lastName}</p>
                      <p className="text-xs text-muted-foreground">{member.position}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] uppercase font-bold ${attendance?.status === 'present' ? 'bg-green-100 text-green-700' :
                        attendance?.status === 'late' ? 'bg-orange-100 text-orange-700' :
                          attendance?.status === 'leave' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {attendance?.status || 'absent'}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="border-b bg-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif">Pending Approvals</CardTitle>
                <CardDescription>Leave & overtime requests</CardDescription>
              </div>
              {pendingApprovals.length > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {pendingApprovals.length} pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {pendingApprovals.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle2 className="size-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">All caught up!</p>
              </div>
            ) : (
              pendingApprovals.map((request, i) => {
                const requestUser = getUserById(request.userId)
                return (
                  <div
                    key={request.id}
                    className={`flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors ${i !== pendingApprovals.length - 1 ? "border-b border-border/30" : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-xs">
                          {requestUser?.firstName[0]}{requestUser?.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {requestUser?.firstName} {requestUser?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {capitalize(request.type)} • {request.startDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Deny
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Reusable Stat Card Component
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color
}: {
  label: string
  value: string
  sub: string
  icon: any
  color: string
}) {
  return (
    <Card className="bg-secondary/20 border-border/30 hover:bg-secondary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="font-bold uppercase tracking-widest text-[10px]">
            {label}
          </CardDescription>
          <Icon className={`size-4 ${color}`} />
        </div>
        <CardTitle className="text-2xl font-serif mt-1">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground font-light">{sub}</p>
      </CardContent>
    </Card>
  )
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ')
}
