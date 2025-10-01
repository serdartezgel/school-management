"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Role } from "@/prisma/client";

import { getAnnouncementColumns } from "./columns";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

const AnnouncementsTable = ({
  role,
  data = { announcements: [], isNext: false, totalAnnouncements: 0 },
}: {
  role: Role;
  data: {
    announcements: AnnouncementDoc[];
    isNext: boolean;
    totalAnnouncements: number;
  };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = getAnnouncementColumns(role, searchParams, pathname);

  return (
    <>
      <DataTable columns={columns} data={data.announcements} />
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination isNext={data.isNext} totalItems={data.totalAnnouncements} />
      </div>
    </>
  );
};

export default AnnouncementsTable;
