interface WeeklyTimetableProps {
  role: "TEACHER" | "STUDENT" | "PARENT";
  entries: TimetableEntry[];
  academicYear: { startDate: Date; endDate: Date };
}

const WeeklyTimetable = ({
  role,
  entries,
  academicYear,
}: WeeklyTimetableProps) => {
  return <div>WeeklyTimetable</div>;
};

export default WeeklyTimetable;
