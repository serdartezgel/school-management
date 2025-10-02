"use client";

import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";

import { getCurrentAcademicYear } from "@/lib/actions/academicYear.action";
import { getStudentAttendances } from "@/lib/actions/attendance.action";
import { getChildren } from "@/lib/actions/parent.action";
import { getStudentPendingTasks } from "@/lib/actions/student.action";
import { AcademicYear } from "@/prisma/client";

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

const ParentDashboard = () => {
  const session = useSession();
  const userId = session.data?.user.id || "";

  const [isPending, startTransition] = useTransition();
  const [children, setChildren] = useState<StudentDoc[]>([]);
  const [academicYear, setAcademicYear] = useState<AcademicYear>(Object);
  const [tasks, setTasks] = useState<StudentTasks[]>([]);
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  useEffect(() => {
    startTransition(async () => {
      const [childrenData, academicYearData] = await Promise.all([
        getChildren({ userId }),
        getCurrentAcademicYear(),
      ]);

      const childrenList = childrenData.data || [];
      setChildren(childrenList);
      setAcademicYear(academicYearData.data!);

      if (childrenList.length > 0) {
        setSelectedChildId(childrenList[0].user.id);
      }
    });
  }, [userId]);

  useEffect(() => {
    if (!selectedChildId || !academicYear?.id) return;

    startTransition(async () => {
      const [tasksData, attendanceData] = await Promise.all([
        getStudentPendingTasks({ userId: selectedChildId }),
        getStudentAttendances({
          userId: selectedChildId,
          academicYearId: academicYear?.id || "",
        }),
      ]);

      setTasks(tasksData.data || []);
      setAttendances(attendanceData.data || []);
    });
  }, [selectedChildId, academicYear]);

  return (
    <>
      <section className="flex md:items-center">
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {children.map((child) => (
              <SelectItem key={child.userId} value={child.userId}>
                {child.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="bg-sidebar flex flex-wrap justify-start gap-4 rounded-lg border-1 p-4 lg:justify-center">
        <h1 className="flex w-full items-start text-xl font-bold">Schedule</h1>
        <Separator />
        {isPending ? (
          <Loader className="size-6 animate-spin" />
        ) : (
          <Timetable
            dailyEntries={[]}
            weeklyEntries={[]}
            academicYear={academicYear}
          />
        )}
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        {isPending ? (
          <Loader className="size-6 w-full animate-spin" />
        ) : (
          <PendingTasksCard tasks={tasks} />
        )}
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        {isPending ? (
          <Loader className="size-6 w-full animate-spin" />
        ) : (
          <AttendanceCard records={attendances} />
        )}
      </section>
    </>
  );
};

export default ParentDashboard;
