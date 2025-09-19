"use client";

import { useState } from "react";

import AttendanceCard from "../cards/AttendanceCard";
import PendingTasksCard from "../cards/PendingTasksCard";
import Timetable from "../timetables/Timetable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

const tasks = [
  {
    id: "1",
    title: "Math Homework 1",
    type: "assignment",
    dueDate: "2025-09-22",
    className: "10A",
    subject: "Mathematics",
    graded: false,
  },
  {
    id: "2",
    title: "Science Lab Report",
    type: "assignment",
    dueDate: "2025-09-25",
    className: "10A",
    subject: "Science",
    graded: true,
  },
  {
    id: "3",
    title: "History Midterm Exam",
    type: "exam",
    dueDate: "2025-10-05",
    className: "10A",
    subject: "History",
    graded: false,
  },
  {
    id: "4",
    title: "English Essay",
    type: "assignment",
    dueDate: "2025-09-28",
    className: "10A",
    subject: "English",
    graded: false,
  },
];

const children = [
  { id: "c1", name: "Alice Johnson" },
  { id: "c2", name: "Bob Smith" },
];

const dummyAttendance = [
  { id: "1", date: "2025-09-19", status: "PRESENT", subject: "Math" },
  { id: "2", date: "2025-09-20", status: "ABSENT", subject: "Science" },
  { id: "3", date: "2025-09-21", status: "LATE", subject: "English" },
  { id: "4", date: "2025-09-22", status: "EXCUSED", subject: "History" },
];

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(children[0].id);

  const academicYear = {
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-06-30"),
  };

  // TODO: filter tasks based on selectedChild
  const filteredTasks = tasks;

  return (
    <>
      <section className="flex md:items-center">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="bg-sidebar flex flex-wrap justify-start gap-4 rounded-lg border-1 p-4 lg:justify-center">
        <h1 className="flex w-full items-start text-xl font-bold">Schedule</h1>
        <Separator />
        <Timetable
          dailyEntries={[]}
          weeklyEntries={[]}
          academicYear={academicYear}
        />
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        <PendingTasksCard tasks={filteredTasks} />
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        <AttendanceCard records={dummyAttendance || []} />
      </section>
    </>
  );
};

export default ParentDashboard;
