"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAttendanceStatus } from "@/lib/actions/attendance.action";
import { AttendanceStatus } from "@/prisma/client";

interface AttendanceStatusSelectProps {
  attendance: AttendanceDoc;
}

export const AttendanceStatusSelect = ({
  attendance,
}: AttendanceStatusSelectProps) => {
  const [status, setStatus] = useState(attendance.status);

  const statusColors: Record<string, string> = {
    PRESENT:
      "bg-green-200 text-green-800 hover:!bg-green-100 focus:!bg-green-100 focus:!text-green-800",
    ABSENT:
      "bg-red-100 text-red-800 hover:!bg-red-200 focus:!bg-red-200 focus:!text-red-800",
    LATE: "bg-yellow-100 text-yellow-800 hover:!bg-yellow-200 focus:!bg-yellow-200 focus:!text-yellow-800",
    EXCUSED:
      "bg-blue-100 text-blue-800 hover:!bg-blue-200 focus:!bg-blue-200 focus:!text-blue-800",
  };

  const handleChange = async (newStatus: AttendanceStatus) => {
    setStatus(newStatus);
    try {
      await updateAttendanceStatus({
        studentId: attendance.studentId,
        classSubjectId: attendance.classSubjectId,
        classTeacherId: attendance.classTeacherId,
        date: attendance.date,
        academicYearId: attendance.academicYearId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update attendance:", error);
      setStatus(attendance.status);
    }
  };

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger className={`w-[120px] ${statusColors[status]}`}>
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(AttendanceStatus).map((s) => (
          <SelectItem key={s} value={s} className={statusColors[s]}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
