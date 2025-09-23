import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/auth";
import SelectFilter from "@/components/filters/SelectFilter";
import FormContainer from "@/components/forms/FormContainer";
import LocalSearch from "@/components/search/LocalSearch";
import ExamsTable from "@/components/tables/ExamsTable";
import { getClasses } from "@/lib/actions/class.action";
import { getExams } from "@/lib/actions/exam.action";
import { getSubjects } from "@/lib/actions/subject.action";

const ExamsPage = async ({ searchParams }: RouteParams) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const role = session.user.role;

  const userId =
    role === "TEACHER"
      ? session.user.id
      : role === "STUDENT"
        ? session.user.id
        : role === "PARENT"
          ? session.user.id
          : undefined;

  const {
    page,
    pageSize,
    query,
    sort,
    sortBy = "date",
    filterByClass = "all",
    filterBySubject = "all",
  } = await searchParams;

  const [classes, subjects] = await Promise.all([
    getClasses({ page: 1, pageSize: 100 }),
    getSubjects({ page: 1, pageSize: 100 }),
  ]);

  const result = await getExams({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    sort: sort || "desc",
    sortBy,
    filterByClass,
    filterBySubject,
    userId,
    role,
  });

  return (
    <div className="container mx-auto mt-16 flex flex-col gap-4 p-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <h1 className="text-2xl font-bold">Exams</h1>
          <h2 className="pl-4 text-xl font-semibold text-gray-500">2025/26</h2>
        </div>

        {(role === "ADMIN" || role === "TEACHER") && (
          <FormContainer table="exam" type="create" />
        )}
      </div>

      <section className="mb-4 flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
        <LocalSearch route="/exams" />
        <div className="flex items-center gap-2">
          <Suspense fallback={<div>Loading...</div>}>
            {(role === "ADMIN" || role === "TEACHER") && (
              <SelectFilter
                placeholder="Select Class"
                filterBy="filterByClass"
                route="/exams"
                data={classes.data?.classes || []}
              />
            )}
            <SelectFilter
              placeholder="Select Subject"
              filterBy="filterBySubject"
              route="/exams"
              data={subjects.data?.subjects || []}
            />
          </Suspense>
        </div>
      </section>
      <ExamsTable role={session.user.role} data={result.data!} />
    </div>
  );
};

export default ExamsPage;
