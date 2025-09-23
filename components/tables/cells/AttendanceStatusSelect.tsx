"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const attendanceDate = dateParam ? new Date(dateParam) : new Date();
  attendanceDate.setHours(0, 0, 0, 0);

  const [status, setStatus] = useState(attendance.attendanceStatus);

  const statusColors: Record<string, string> = {
    PRESENT:
      "bg-green-200 text-green-800 hover:!bg-green-100 focus:!bg-green-100 focus:!text-green-800",
    ABSENT:
      "bg-red-100 text-red-800 hover:!bg-red-200 focus:!bg-red-200 focus:!text-red-800",
    LATE: "bg-yellow-100 text-yellow-800 hover:!bg-yellow-200 focus:!bg-yellow-200 focus:!text-yellow-800",
    EXCUSED:
      "bg-blue-100 text-blue-800 hover:!bg-blue-200 focus:!bg-blue-200 focus:!text-blue-800",
    PENDING: "",
  };

  const handleChange = async (newStatus: AttendanceStatus) => {
    try {
      await updateAttendanceStatus({
        studentId: attendance.id,
        classSubjectId: attendance.classSubject.id,
        date: attendanceDate,
        academicYearId: attendance.classSubject.class.academicYearId,
        status: newStatus,
      });
      setStatus(newStatus);
      toast.success("Succes", {
        description: "Attendance updated successfully.",
      });
    } catch (error) {
      toast.error("Failed", { description: "Operation failed." });
      console.log(error);
      setStatus(attendance.attendanceStatus);
    }
  };

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger className={`w-[180px] ${statusColors[status]}`}>
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
