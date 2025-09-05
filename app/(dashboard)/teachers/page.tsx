import { redirect } from "next/navigation";

import { auth } from "@/auth";
import TeachersTable from "@/components/tables/TeachersTable";
import { getTeachers } from "@/lib/actions/teacher.action";

const TeachersPage = async ({ searchParams }: RouteParams) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const { page, pageSize, query, sort } = await searchParams;

  const result = await getTeachers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    sort: sort || "asc",
  });

  return (
    <div className="container mx-auto mt-16 p-10">
      <h1 className="pb-4 text-2xl font-bold">Teachers List</h1>
      <TeachersTable role={session.user.role} data={result.data!} />
    </div>
  );
};

export default TeachersPage;
