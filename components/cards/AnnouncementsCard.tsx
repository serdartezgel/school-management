import Link from "next/link";

import AnnouncementCard from "./AnnouncementCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const data = [
  {
    title: "Parent-Teacher Meeting",
    date: new Date("2025-09-05"),
    description:
      "A parent-teacher meeting will be held to discuss student progress and upcoming activities.",
  },
  {
    title: "Sports Day",
    date: new Date("2025-09-12"),
    description:
      "Annual Sports Day will include track events, team games, and fun activities for all grades.",
  },
  {
    title: "Exam Schedule Released",
    date: new Date("2025-09-20"),
    description:
      "The mid-term exam schedule has been published. Students are advised to check the notice board.",
  },
  {
    title: "Science Fair",
    date: new Date("2025-09-28"),
    description:
      "Students are encouraged to participate in the annual Science Fair to showcase their projects.",
  },
  {
    title: "Holiday Notice",
    date: new Date("2025-10-02"),
    description:
      "School will remain closed on October 2nd in observance of Gandhi Jayanti.",
  },
];

const AnnouncementsCard = () => {
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
        {data.map((item) => (
          <AnnouncementCard key={item.title} data={item} />
        ))}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsCard;
