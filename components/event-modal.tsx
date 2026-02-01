"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ControllerRenderProps } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateEventMutation } from "@/lib/queries/presence-queries"
import { toast } from "sonner"
import { format } from "date-fns"

const eventSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    type: z.string().min(1, "Type is required"),
    mode: z.enum(["office", "remote", "hybrid"]),
    location: z.string().optional(),
    meetingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    selectedDate?: Date
}

export function EventModal({ isOpen, onClose, selectedDate }: EventModalProps) {
    const createEvent = useCreateEventMutation()

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            description: "",
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            startTime: "09:00",
            endTime: "10:00",
            type: "meeting",
            mode: "office",
            location: "",
            meetingLink: "",
        },
    })

    React.useEffect(() => {
        if (selectedDate && isOpen) {
            form.setValue("date", format(selectedDate, 'yyyy-MM-dd'))
        }
    }, [selectedDate, isOpen, form])

    const onSubmit = (values: EventFormValues) => {
        const start = new Date(`${values.date}T${values.startTime}`)
        const end = new Date(`${values.date}T${values.endTime}`)

        createEvent.mutate({
            title: values.title,
            description: values.description,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            type: values.type,
            mode: values.mode,
            location: values.location,
            meetingLink: values.meetingLink,
        }, {
            onSuccess: () => {
                toast.success("Event created successfully")
                form.reset()
                onClose()
            },
            onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to create event")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">Schedule New Event</DialogTitle>
                    <DialogDescription>
                        Create a new meeting, event, or holiday for the team.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }: { field: ControllerRenderProps<EventFormValues, "title"> }) => (
                                <FormItem>
                                    <FormLabel>Event Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Weekly Sync" {...field} className="rounded-xl border-border/40" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }: { field: ControllerRenderProps<EventFormValues, "date"> }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="rounded-xl border-border/40" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }: { field: ControllerRenderProps<EventFormValues, "type"> }) => (
                                    <FormItem>
                                        <FormLabel>Event Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-xl border-border/40">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="meeting">Meeting</SelectItem>
                                                <SelectItem value="event">Company Event</SelectItem>
                                                <SelectItem value="holiday">Holiday</SelectItem>
                                                <SelectItem value="deadline">Deadline</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }: { field: ControllerRenderProps<EventFormValues, "startTime"> }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} className="rounded-xl border-border/40" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }: { field: ControllerRenderProps<EventFormValues, "endTime"> }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} className="rounded-xl border-border/40" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="mode"
                            render={({ field }: { field: ControllerRenderProps<EventFormValues, "mode"> }) => (
                                <FormItem>
                                    <FormLabel>Work Mode</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-border/40">
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="office">In-Office</SelectItem>
                                            <SelectItem value="remote">Remote</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }: { field: ControllerRenderProps<EventFormValues, "location"> }) => (
                                <FormItem>
                                    <FormLabel>Location / Meeting Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Room name or URL" {...field} className="rounded-xl border-border/40" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }: { field: ControllerRenderProps<EventFormValues, "description"> }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Agenda or details..."
                                            {...field}
                                            className="rounded-xl border-border/40 min-h-[80px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl px-8 bg-primary"
                                disabled={createEvent.isPending}
                            >
                                {createEvent.isPending ? "Scheduling..." : "Create Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

