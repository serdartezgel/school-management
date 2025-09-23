"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getExamColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

const ExamsTable = ({
  role,
  data = { exams: [], isNext: false, totalExams: 0 },
}: {
  role: Role;
  data: { exams: ExamDoc[]; isNext: boolean; totalExams: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getExamColumns(role, searchParams, pathname);

  return (
    <>
      <DataTable columns={columns} data={data.exams} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalExams} />
      </div>
    </>
  );
};

export default ExamsTable;
