"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getAssignmentColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

const AssignmentsTable = ({
  role,
  data = { assignments: [], isNext: false, totalAssignments: 0 },
}: {
  role: Role;
  data: { assignments: ExamDoc[]; isNext: boolean; totalAssignments: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getAssignmentColumns(role, searchParams, pathname);

  return (
    <>
      <DataTable columns={columns} data={data.assignments} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalAssignments} />
      </div>
    </>
  );
};

export default AssignmentsTable;
