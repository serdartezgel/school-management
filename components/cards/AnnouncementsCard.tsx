import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAnnouncements } from "@/lib/actions/announcement.action";

import AnnouncementCard from "./AnnouncementCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const AnnouncementsCard = async () => {
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

  const result = await getAnnouncements({
    sortBy: "date",
    sort: "desc",
    userId,
    role,
  });

  return (
    <Card className="bg-sidebar rounded-md p-4">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-semibold">Announcements</span>
          <Link href="/announcements" className="text-xs text-gray-400">
            View All
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        {result.data?.announcements.map((item) => (
          <AnnouncementCard key={item.id} data={item} />
        ))}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsCard;
