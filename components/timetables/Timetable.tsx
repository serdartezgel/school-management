"use client";

import DailyTimetable from "./DailyTimetable";
import WeeklyTimetable from "./WeeklyTimetable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface TimetableProps {
  dailyEntries: TimetableEntry[];
  weeklyEntries: TimetableEntry[];
  academicYear: { startDate: Date; endDate: Date };
}

const Timetable = ({
  dailyEntries,
  weeklyEntries,
  academicYear,
}: TimetableProps) => {
  return (
    <div className="flex h-[700px] w-full flex-col gap-6 overflow-x-auto">
      <Tabs
        defaultValue="daily"
        className="flex h-full w-full items-start justify-start gap-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="h-full w-full min-w-md">
          <DailyTimetable
            entries={dailyEntries}
            academicYear={academicYear}
            view="day"
          />
        </TabsContent>
        <TabsContent value="weekly" className="h-full w-full min-w-md">
          <WeeklyTimetable
            entries={weeklyEntries}
            academicYear={academicYear}
            view="work_week"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timetable;
