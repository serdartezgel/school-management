interface DailyTimetableProps {
  role: "TEACHER" | "STUDENT" | "PARENT";
  entries: TimetableEntry[];
  academicYear: { startDate: Date; endDate: Date };
}

const DailyTimetable = ({
  role,
  entries,
  academicYear,
}: DailyTimetableProps) => {
  return <div>DailyTimetable</div>;
};

export default DailyTimetable;
