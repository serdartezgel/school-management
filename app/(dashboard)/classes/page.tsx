import { redirect } from "next/navigation";

import { auth } from "@/auth";
import FormContainer from "@/components/forms/FormContainer";
import ClassesTable from "@/components/tables/ClassesTable";
import { getClasses } from "@/lib/actions/class.action";

const ClassesPage = async ({ searchParams }: RouteParams) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const role = session.user.role;

  if (role !== "ADMIN" && role !== "TEACHER") redirect("/");

  const { page, pageSize, query, sort } = await searchParams;

  const result = await getClasses({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    sort: sort || "asc",
  });

  return (
    <div className="container mx-auto mt-16 p-10">
      <div className="flex items-center justify-between">
        <h1 className="pb-4 text-2xl font-bold">Classes List</h1>

        {role === "ADMIN" && <FormContainer table="class" type="create" />}
      </div>
      <ClassesTable role={session.user.role} data={result.data!} />
    </div>
  );
};

export default ClassesPage;
