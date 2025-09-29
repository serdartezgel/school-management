"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getGradeColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

const GradesTable = ({
  role,
  data = { grades: [], isNext: false, totalGrades: 0 },
}: {
  role: Role;
  data: { grades: GradeDoc[]; isNext: boolean; totalGrades: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getGradeColumns(role, searchParams, pathname);

  return (
    <>
      <DataTable columns={columns} data={data.grades} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalGrades} />
      </div>
    </>
  );
};

export default GradesTable;
