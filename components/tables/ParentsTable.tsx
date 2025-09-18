"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getParentColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import LocalSearch from "../search/LocalSearch";

const ParentsTable = ({
  role,
  data = { parents: [], isNext: false, totalParents: 0 },
}: {
  role: Role;
  data: { parents: ParentDoc[]; isNext: boolean; totalParents: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getParentColumns(role, searchParams, pathname);

  return (
    <>
      <LocalSearch route="/parents" />
      <DataTable columns={columns} data={data.parents} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalParents} />
      </div>
    </>
  );
};

export default ParentsTable;
