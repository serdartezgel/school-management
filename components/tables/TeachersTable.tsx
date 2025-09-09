"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getTeacherColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import LocalSearch from "../search/LocalSearch";

const TeachersTable = ({
  role,
  data,
}: {
  role: Role;
  data: { teachers: TeacherDoc[]; isNext: boolean; totalTeachers: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getTeacherColumns(role, searchParams, pathname);

  return (
    <>
      <LocalSearch route="/teachers" />
      <DataTable columns={columns} data={data.teachers} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalTeachers} />
      </div>
    </>
  );
};

export default TeachersTable;
