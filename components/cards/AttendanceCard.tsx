"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const AttendanceCard = ({ records }: { records: StudentAttendance[] }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-muted-foreground">No missed classes 🎉</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {records.map((record) => (
              <li
                key={record.id}
                className="hover:bg-muted flex justify-between rounded-md border px-4 py-2"
              >
                <div>
                  <p className="font-medium">
                    {record.subject ? `${record.subject} - ` : ""}
                    {new Date(record.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className={`font-semibold capitalize ${
                    record.status === "ABSENT"
                      ? "text-red-600"
                      : record.status === "LATE"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                >
                  {record.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
