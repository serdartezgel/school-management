"use client";

import Link from "next/link";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

import EventCard from "./EventCard";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const data = [
  {
    title: "Math Lecture",
    description: "Algebra and Geometry topics covered in detail.",
    startTime: new Date("2025-09-02T09:00:00"),
    endTime: new Date("2025-09-02T10:30:00"),
  },
  {
    title: "Science Lab",
    description: "Physics experiments on motion and forces.",
    startTime: new Date("2025-09-02T11:00:00"),
    endTime: new Date("2025-09-02T12:30:00"),
  },
  {
    title: "English Literature",
    description: "Analyzing classic poems and prose.",
    startTime: new Date("2025-09-02T13:00:00"),
    endTime: new Date("2025-09-02T14:00:00"),
  },
  {
    title: "History Class",
    description: "World War II and its global impact.",
    startTime: new Date("2025-09-03T09:00:00"),
    endTime: new Date("2025-09-03T10:30:00"),
  },
  {
    title: "Art Workshop",
    description: "Practical session on sketching and painting.",
    startTime: new Date("2025-09-03T11:00:00"),
    endTime: new Date("2025-09-03T12:30:00"),
  },
  {
    title: "Computer Science",
    description: "Introduction to algorithms and data structures.",
    startTime: new Date("2025-09-03T13:00:00"),
    endTime: new Date("2025-09-03T14:30:00"),
  },
  {
    title: "Physical Education",
    description: "Outdoor sports and fitness activities.",
    startTime: new Date("2025-09-04T09:00:00"),
    endTime: new Date("2025-09-04T10:30:00"),
  },
  {
    title: "Chemistry Lecture",
    description: "Organic chemistry basics and lab safety.",
    startTime: new Date("2025-09-04T11:00:00"),
    endTime: new Date("2025-09-04T12:30:00"),
  },
  {
    title: "Music Class",
    description: "Learning musical instruments and theory.",
    startTime: new Date("2025-09-04T13:00:00"),
    endTime: new Date("2025-09-04T14:00:00"),
  },
];

const EventsCard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const events = data.filter(
    (event) =>
      event.startTime.toLocaleDateString() === date?.toLocaleDateString(),
  );

  console.log(events);

  return (
    <>
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        weekStartsOn={1}
        required
        buttonVariant={"outline"}
        className="w-full rounded-t-lg border shadow-sm"
      />
      <Card className="bg-background rounded-t-none rounded-b-lg p-4">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">Events</span>
            <Link href="/events" className="text-xs text-gray-400">
              View All
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          {events.length > 0 ? (
            events?.map((event) => <EventCard key={event.title} data={event} />)
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
