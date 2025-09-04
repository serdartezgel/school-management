import { redirect } from "next/navigation";

import { auth } from "@/auth";
import TeachersTable from "@/components/tables/TeachersTable";

const TeachersPage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="container mx-auto mt-16 p-10">
      <h1 className="pb-4 text-2xl font-bold">Teachers List</h1>
      <TeachersTable role={session.user.role} />
    </div>
  );
};

export default TeachersPage;
