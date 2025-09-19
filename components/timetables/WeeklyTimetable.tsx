"use client";

import moment from "moment";
import { useState } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  ToolbarProps,
  DateLocalizer,
} from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "../ui/button";

interface WeeklyTimetableProps {
  entries: TimetableEntry[];
  academicYear: { startDate: Date; endDate: Date };
  view: View;
}

const WeeklyTimetable = ({
  entries,
  academicYear,
  view,
}: WeeklyTimetableProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const userLocale =
    typeof navigator !== "undefined" ? navigator.language : "en";
  moment.locale(userLocale);

  const localizer = momentLocalizer(moment);

  const formats = {
    // Day view header: shows weekday + day (e.g., "Fri 19")
    dayHeaderFormat: (
      date: Date,
      culture?: string,
      localizer?: DateLocalizer,
    ) => localizer!.format(date, "MMM D, ddd", culture),

    // Week view header: range of dates (e.g., "Sep 19 — Sep 23")
    dayRangeHeaderFormat: (
      range: { start: Date; end: Date },
      culture?: string,
      localizer?: DateLocalizer,
    ) =>
      `${localizer!.format(range.start, "MMM D", culture)} — ${localizer!.format(range.end, "MMM D", culture)}`,

    // Event time range format (e.g., "08:00 — 09:30")
    agendaTimeRangeFormat: (
      range: { start: Date; end: Date },
      culture?: string,
      localizer?: DateLocalizer,
    ) =>
      `${localizer!.format(range.start, "HH:mm", culture)} — ${localizer!.format(range.end, "HH:mm", culture)}`,
  };

  const events = entries.map((entry) => ({
    title: `${entry.type === "exam" ? "Exam: " : ""}${entry.name}`,
    start: new Date(`${entry.day}T${entry.startTime}`),
    end: new Date(`${entry.day}T${entry.endTime}`),
  }));

  const getMinTime = (academicYear: { startDate: Date }) => {
    const minTime = new Date(academicYear.startDate);
    minTime.setHours(8, 0, 0, 0); // start of day at 8 AM
    return minTime;
  };

  const getMaxTime = (academicYear: { endDate: Date }) => {
    const maxTime = new Date(academicYear.endDate);
    maxTime.setHours(18, 0, 0, 0); // end of day at 5 PM
    return maxTime;
  };

  return (
    <Calendar
      localizer={localizer}
      formats={formats}
      events={events}
      startAccessor="start"
      endAccessor="end"
      view={view}
      views={{ work_week: true }}
      onView={() => {}}
      date={currentDate}
      onNavigate={(date) => setCurrentDate(date)}
      style={{ height: "100%", width: "100%" }}
      min={getMinTime(academicYear)}
      max={getMaxTime(academicYear)}
      step={60}
      timeslots={1}
      components={{
        toolbar: ({
          label,
          onNavigate,
        }: ToolbarProps<
          {
            title: string;
            start: Date;
            end: Date;
          },
          object
        >) => (
          <div className="mb-2 flex w-full items-center justify-between gap-5 max-md:justify-start">
            {/* Right side: current date */}
            <div className="text-lg font-semibold">{label}</div>

            {/* Optional: navigation buttons */}
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => onNavigate("PREV")}
              >
                &lt;
              </Button>
              <Button
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => onNavigate("TODAY")}
              >
                Today
              </Button>
              <Button
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => onNavigate("NEXT")}
              >
                &gt;
              </Button>
            </div>
          </div>
        ),
      }}
    />
  );
};

export default WeeklyTimetable;
