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
import { useScheduleQuery } from "@/lib/queries/presence-queries"
import { EventModal } from "@/components/event-modal"
import { format, isSameDay, startOfMonth, endOfMonth } from "date-fns"

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function SchedulePage() {
    const { user } = useAuth()
    const [currentDate, setCurrentDate] = React.useState(new Date())
    const [selectedDay, setSelectedDay] = React.useState<number | null>(null)
    const [isEventModalOpen, setIsEventModalOpen] = React.useState(false)

    // Fetch real events for the current month
    const { data: events = [], isLoading } = useScheduleQuery(
        startOfMonth(currentDate),
        endOfMonth(currentDate)
    )

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
        const day = selectedDay || today.getDate()
        const date = new Date(year, month, day)
        return {
            date,
            dayName: fullDays[date.getDay()],
            shortDay: daysOfWeek[date.getDay()],
            formatted: format(date, 'MMMM do, yyyy')
        }
    }

    const selectedDayInfo = getSelectedDayInfo()

    // Filter events for selected day
    const dayEvents = events.filter(event =>
        isSameDay(new Date(event.startTime), selectedDayInfo.date)
    )

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
                {user.role !== 'staff' && (
                    <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={() => setIsEventModalOpen(true)}>
                        <Plus className="size-4 mr-2" />
                        Add Event
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2 border-border/30 shadow-sm overflow-hidden">
                    <CardHeader className="border-b bg-secondary/5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-serif">{monthName}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="size-8 rounded-lg" onClick={() => navigateMonth(-1)}>
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-lg px-4" onClick={() => setCurrentDate(new Date())}>
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
                                <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                if (day === null) return <div key={`empty-${index}`} className="aspect-square" />

                                const date = new Date(year, month, day)
                                const dayEvents = events.filter(e => isSameDay(new Date(e.startTime), date))
                                const isSelected = selectedDay === day || (selectedDay === null && isToday(day))
                                const isCurrentDay = isToday(day)

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDay(day)}
                                        className={`
                                            aspect-square p-2 rounded-2xl text-sm font-medium transition-all relative group
                                            ${isCurrentDay ? 'bg-primary text-primary-foreground shadow-md' : ''}
                                            ${isSelected && !isCurrentDay ? 'bg-secondary ring-2 ring-primary/20' : ''}
                                            ${!isCurrentDay && !isSelected ? 'hover:bg-secondary/50' : ''}
                                        `}
                                    >
                                        <span className="relative z-10">{day}</span>
                                        {dayEvents.length > 0 && (
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                {dayEvents.slice(0, 3).map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`w-1 h-1 rounded-full ${isCurrentDay ? 'bg-primary-foreground/60' : 'bg-primary/60'}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule for Selected Day */}
                <Card className="border-border/30 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="border-b bg-secondary/5">
                        <CardTitle className="text-xl font-serif">
                            {selectedDayInfo.dayName}
                        </CardTitle>
                        <CardDescription>
                            {selectedDayInfo.formatted}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto">
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-sm text-muted-foreground">Loading schedule...</p>
                            </div>
                        ) : dayEvents.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Coffee className="size-6 text-muted-foreground/40" />
                                </div>
                                <p className="text-sm text-muted-foreground font-light italic">No events scheduled for this day</p>
                                {user.role !== 'staff' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-4 rounded-xl text-primary"
                                        onClick={() => setIsEventModalOpen(true)}
                                    >
                                        <Plus className="size-3 mr-2" /> Add first event
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-border/20">
                                {dayEvents.map((event, i) => {
                                    const Icon = getEventIcon(event.type)
                                    const startTime = format(new Date(event.startTime), 'p')
                                    const isRemote = event.mode === 'remote'

                                    return (
                                        <div key={event.id || i} className="p-5 hover:bg-secondary/10 transition-colors group">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${isRemote ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                                    }`}>
                                                    <Icon className="size-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{event.title}</p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium bg-secondary/40 px-2 py-0.5 rounded-full">
                                                            <Clock className="size-3" />
                                                            {startTime}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-[9px] uppercase font-bold border-none ${isRemote ? 'bg-blue-100/50 text-blue-700' : 'bg-green-100/50 text-green-700'
                                                                }`}
                                                        >
                                                            {event.mode}
                                                        </Badge>
                                                    </div>
                                                    {event.location && (
                                                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                                                            <MapPin className="size-3" />
                                                            {event.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                selectedDate={selectedDayInfo.date}
            />

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
