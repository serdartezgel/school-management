"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getClassColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import LocalSearch from "../search/LocalSearch";

const ClassesTable = ({
  role,
  data = { classes: [], isNext: false, totalClasses: 0 },
}: {
  role: Role;
  data: { classes: ClassDoc[]; isNext: boolean; totalClasses: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getClassColumns(role, searchParams, pathname);

  return (
    <>
      <LocalSearch route="/classes" />
      <DataTable columns={columns} data={data.classes} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalClasses} />
      </div>
    </>
  );
};

export default ClassesTable;
