"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Video,
    Users,
    Coffee,
    Plus
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Mock schedule data
const mockEvents: Record<string, { time: string; title: string; type: string; mode: string }[]> = {
    'Mon': [
        { time: '09:00', title: 'Morning Standup', type: 'meeting', mode: 'remote' },
        { time: '11:00', title: 'Design Review', type: 'meeting', mode: 'office' },
        { time: '14:00', title: 'Sprint Planning', type: 'meeting', mode: 'office' },
    ],
    'Tue': [
        { time: '10:00', title: 'Client Call', type: 'meeting', mode: 'remote' },
        { time: '15:00', title: '1:1 with Manager', type: 'meeting', mode: 'office' },
    ],
    'Wed': [
        { time: '09:00', title: 'Morning Standup', type: 'meeting', mode: 'remote' },
        { time: '13:00', title: 'Lunch & Learn', type: 'event', mode: 'office' },
    ],
    'Thu': [
        { time: '09:00', title: 'Morning Standup', type: 'meeting', mode: 'remote' },
        { time: '11:00', title: 'Code Review', type: 'meeting', mode: 'office' },
        { time: '16:00', title: 'Team Retrospective', type: 'meeting', mode: 'office' },
    ],
    'Fri': [
        { time: '09:00', title: 'Morning Standup', type: 'meeting', mode: 'remote' },
        { time: '14:00', title: 'Weekly Wrap-up', type: 'meeting', mode: 'remote' },
    ],
}

export default function SchedulePage() {
    const { user } = useAuth()
    const [currentDate, setCurrentDate] = React.useState(new Date())
    const [selectedDay, setSelectedDay] = React.useState<number | null>(null)

    if (!user) return null

    // Get calendar data
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Generate calendar days
    const calendarDays = []
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i)
    }

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(year, month + direction, 1))
        setSelectedDay(null)
    }

    const isToday = (day: number) => {
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    }

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'meeting': return Video
            case 'event': return Coffee
            default: return Clock
        }
    }

    // Get selected day's full date and day name
    const getSelectedDayInfo = () => {
        if (selectedDay === null) return null
        const date = new Date(year, month, selectedDay)
        return {
            dayName: fullDays[date.getDay()],
            shortDay: daysOfWeek[date.getDay()],
            formatted: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }
    }

    const selectedDayInfo = getSelectedDayInfo()

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
                        {user.role === 'staff' ? 'My Schedule' : 'Schedule'}
                    </h1>
                    <p className="text-muted-foreground font-light mt-1">
                        View and manage your work schedule
                    </p>
                </div>
                <Button className="rounded-xl">
                    <Plus className="size-4 mr-2" />
                    Add Event
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2 border-border/30">
                    <CardHeader className="border-b bg-secondary/10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-serif">{monthName}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="size-8 rounded-lg" onClick={() => navigateMonth(-1)}>
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setCurrentDate(new Date())}>
                                    Today
                                </Button>
                                <Button variant="outline" size="icon" className="size-8 rounded-lg" onClick={() => navigateMonth(1)}>
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {daysOfWeek.map(day => (
                                <div key={day} className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                const dayOfWeek = (firstDayOfMonth + (day || 1) - 1) % 7
                                const hasEvents = day && mockEvents[daysOfWeek[dayOfWeek]]?.length > 0
                                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                                return (
                                    <button
                                        key={index}
                                        onClick={() => day && setSelectedDay(day)}
                                        disabled={!day}
                                        className={`
                      aspect-square p-2 rounded-xl text-sm font-medium transition-all relative
                      ${!day ? 'invisible' : ''}
                      ${isToday(day || 0) ? 'bg-primary text-primary-foreground' : ''}
                      ${selectedDay === day && !isToday(day || 0) ? 'bg-secondary ring-2 ring-primary' : ''}
                      ${!isToday(day || 0) && selectedDay !== day ? 'hover:bg-secondary/50' : ''}
                      ${isWeekend && !isToday(day || 0) ? 'text-muted-foreground/50' : ''}
                    `}
                                    >
                                        {day}
                                        {hasEvents && !isToday(day || 0) && (
                                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule for Selected Day */}
                <Card className="border-border/30">
                    <CardHeader className="border-b bg-secondary/10">
                        <CardTitle className="text-xl font-serif">
                            {selectedDayInfo ? selectedDayInfo.dayName : "Today's Schedule"}
                        </CardTitle>
                        <CardDescription>
                            {selectedDayInfo ? selectedDayInfo.formatted : today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {(() => {
                            const dayKey = selectedDayInfo?.shortDay || daysOfWeek[today.getDay()]
                            const events = mockEvents[dayKey] || []

                            if (events.length === 0) {
                                return (
                                    <div className="p-8 text-center">
                                        <Coffee className="size-8 mx-auto text-muted-foreground/30 mb-3" />
                                        <p className="text-sm text-muted-foreground">No events scheduled</p>
                                    </div>
                                )
                            }

                            return (
                                <div className="divide-y divide-border/30">
                                    {events.map((event, i) => {
                                        const Icon = getEventIcon(event.type)
                                        return (
                                            <div key={i} className="p-4 hover:bg-secondary/20 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${event.mode === 'remote' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                                        }`}>
                                                        <Icon className="size-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{event.title}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Clock className="size-3" />
                                                                {event.time}
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className={`text-[9px] uppercase font-bold ${event.mode === 'remote' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                                                    }`}
                                                            >
                                                                {event.mode}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })()}
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Work Mode */}
            <Card className="border-border/30">
                <CardHeader className="border-b bg-secondary/10">
                    <CardTitle className="text-xl font-serif">Weekly Work Schedule</CardTitle>
                    <CardDescription>Your default work modes for each day</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-5 divide-x divide-border/30">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => {
                            const modes = ['office', 'hybrid', 'office', 'office', 'remote']
                            const mode = modes[i]

                            return (
                                <div key={day} className="p-4 text-center hover:bg-secondary/10 transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                                        {day.slice(0, 3)}
                                    </p>
                                    <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${mode === 'office' ? 'bg-green-100 text-green-600' :
                                        mode === 'remote' ? 'bg-blue-100 text-blue-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                        <MapPin className="size-5" />
                                    </div>
                                    <p className="text-sm font-medium capitalize">{mode}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">9AM - 5PM</p>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-border/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-serif">Upcoming Events</CardTitle>
                            <CardDescription>Your scheduled meetings and events</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            View All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { day: 'Tomorrow', title: 'Sprint Planning', time: '10:00 AM', attendees: 8 },
                            { day: 'Wed, Jan 8', title: 'Product Demo', time: '2:00 PM', attendees: 15 },
                            { day: 'Fri, Jan 10', title: 'Team Celebration', time: '4:00 PM', attendees: 25 },
                        ].map((event, i) => (
                            <Card key={i} className="border-border/30 bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer">
                                <CardContent className="p-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                                        {event.day}
                                    </p>
                                    <h3 className="font-semibold mb-2">{event.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3.5" />
                                            {event.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="size-3.5" />
                                            {event.attendees}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
