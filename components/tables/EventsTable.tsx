"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getEventColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

const EventsTable = ({
  role,
  data = { events: [], isNext: false, totalEvents: 0 },
}: {
  role: Role;
  data: { events: EventDoc[]; isNext: boolean; totalEvents: number };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getEventColumns(role, searchParams, pathname);

  return (
    <>
      <DataTable columns={columns} data={data.events} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalEvents} />
      </div>
    </>
  );
};

export default EventsTable;
