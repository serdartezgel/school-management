"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getAttendanceColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

const AttendanceTable = ({
  role,
  data = { attendances: [], isNext: false, totalAttendances: 0 },
}: {
  role: Role;
  data: {
    attendances: AttendanceDoc[];
    isNext: boolean;
    totalAttendances: number;
  };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getAttendanceColumns(role, searchParams, pathname);

  return (
    <>
      <DataTable columns={columns} data={data.attendances} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalAttendances} />
      </div>
    </>
  );
};

export default AttendanceTable;
