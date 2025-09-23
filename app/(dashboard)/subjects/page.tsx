import { redirect } from "next/navigation";

import { auth } from "@/auth";
import FormContainer from "@/components/forms/FormContainer";
import SubjectsTable from "@/components/tables/SubjectsTable";
import { getSubjects } from "@/lib/actions/subject.action";

const SubjectsPage = async ({ searchParams }: RouteParams) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const role = session.user.role;

  if (role !== "ADMIN") redirect("/");

  const { page, pageSize, query, sort } = await searchParams;

  const result = await getSubjects({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    sort: sort || "asc",
  });

  return (
    <div className="container mx-auto mt-16 p-10">
      <div className="flex items-center justify-between">
        <h1 className="pb-4 text-2xl font-bold">Subjects List</h1>

        {role === "ADMIN" && <FormContainer table="subject" type="create" />}
      </div>
      <SubjectsTable role={session.user.role} data={result.data!} />
    </div>
  );
};

export default SubjectsPage;
