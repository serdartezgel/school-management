"use client";

import { format } from "date-fns";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { getEventDays, getEvents } from "@/lib/actions/event.action";

import EventCard from "./EventCard";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const EventsCard = () => {
  const session = useSession();

  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [eventDays, setEventDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const role = session.data?.user.role;
  const userId =
    role === "TEACHER"
      ? session.data?.user.id
      : role === "STUDENT"
        ? session.data?.user.id
        : role === "PARENT"
          ? session.data?.user.id
          : undefined;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      const result = await getEvents({
        page: 1,
        pageSize: 100,
        userId,
        role,
        date,
      });

      if (result.success) {
        setEvents(result.data?.events ?? []);
      }

      setLoading(false);
    };

    fetchEvents();
  }, [date, role, userId]);

  useEffect(() => {
    const fetchEventDays = async () => {
      const result = await getEventDays({
        month: month.toISOString(),
        userId,
        role,
      });

      if (result.success) {
        setEventDays(result.data?.days ?? []);
      }
    };

    fetchEventDays();
  }, [month, role, userId]);

  const eventDaysSet = new Set(eventDays);

  return (
    <>
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        month={month}
        onMonthChange={setMonth}
        weekStartsOn={1}
        required
        buttonVariant={"outline"}
        showOutsideDays={false}
        captionLayout="dropdown"
        className="bg-sidebar w-full rounded-t-lg border border-b-0 shadow-sm"
        modifiers={{
          hasEvent: (day) => eventDaysSet.has(format(day, "yyyy-MM-dd")),
        }}
        modifiersClassNames={{
          hasEvent:
            "relative bg-primary/20 dark:bg-secondary/20 text-primary dark:text-secondary font-medium rounded-md after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-secondary",
        }}
      />
      <Card className="bg-sidebar rounded-t-none rounded-b-lg p-4">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">Events</span>
            <Link href="/events" className="text-xs text-gray-400">
              View All
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="mx-auto flex flex-col gap-4 px-0">
          {loading ? (
            <Loader className="size-6 animate-spin" />
          ) : events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} data={event} />)
          ) : (
            <p className="text-sm font-light">
              No planned events for selected day.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};
export default EventsCard;
