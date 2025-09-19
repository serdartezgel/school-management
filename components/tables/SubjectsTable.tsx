"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getSubjectColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import LocalSearch from "../search/LocalSearch";

const SubjectsTable = ({
  role,
  data = { subjects: [], isNext: false, totalSubjects: 0 },
}: {
  role: Role;
  data: { subjects: ClassDoc[]; isNext: boolean; totalSubjects: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getSubjectColumns(role, searchParams, pathname);

  return (
    <>
      <LocalSearch route="/subjects" />
      <DataTable columns={columns} data={data.subjects} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalSubjects} />
      </div>
    </>
  );
};

export default SubjectsTable;
