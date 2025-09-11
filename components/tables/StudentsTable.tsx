"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getStudentColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import LocalSearch from "../search/LocalSearch";

const StudentsTable = ({
  role,
  data = { students: [], isNext: false, totalStudents: 0 },
}: {
  role: Role;
  data: { students: StudentDoc[]; isNext: boolean; totalStudents: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getStudentColumns(role, searchParams, pathname);

  return (
    <>
      <LocalSearch route="/students" />
      <DataTable columns={columns} data={data.students} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalStudents} />
      </div>
    </>
  );
};

export default StudentsTable;
