"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getAttendanceColumns } from "./columns";
import DataTable from "./DataTable";

const AttendanceTable = ({
  role,
  data = { attendances: [] },
}: {
  role: Role;
  data: {
    attendances: StudentWithAttendanceDoc[];
  };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getAttendanceColumns(role, searchParams, pathname);

  return (
    <>
      <DataTable columns={columns} data={data.attendances} />
    </>
  );
};

export default AttendanceTable;
