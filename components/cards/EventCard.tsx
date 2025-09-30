"use client";

import { format } from "date-fns";
import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const EventCard = ({ data }: { data: EventDoc }) => {
  return (
    <Card className="bg-primary rounded-md p-4">
      <CardHeader className="px-0">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 font-medium">
          <span className="flex items-center gap-2 text-white">
            {data.isImportant && (
              <Star className="h-4 w-4 fill-red-500 text-red-500" />
            )}
            {data.title}
          </span>
          <span className="rounded-md px-1 py-1 text-xs text-gray-300">
            {format(new Date(data.startDate), "PPp")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 text-sm text-gray-300">
        {data.description}
      </CardContent>
    </Card>
  );
};
export default EventCard;
