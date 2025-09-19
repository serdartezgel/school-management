import DailyTimetable from "./DailyTimetable";
import WeeklyTimetable from "./WeeklyTimetable";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface TimetableProps {
  role: "TEACHER" | "STUDENT" | "PARENT";
  dailyEntries: TimetableEntry[];
  weeklyEntries: TimetableEntry[];
  academicYear: { startDate: Date; endDate: Date };
}

const Timetable = ({
  role,
  dailyEntries,
  weeklyEntries,
  academicYear,
}: TimetableProps) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs
        defaultValue="daily"
        className="flex w-full items-center justify-center"
      >
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="daily">
          <DailyTimetable
            entries={dailyEntries}
            role={role}
            academicYear={academicYear}
          />
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyTimetable
            entries={weeklyEntries}
            role={role}
            academicYear={academicYear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timetable;
