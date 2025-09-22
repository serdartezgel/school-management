type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  filterBy?: string;
  sort?: SortOrder | undefined;
  sortBy?: string;
  filterByClass?: string;
  filterBySubject?: string;
}

type FormDataMap = {
  teacher: TeacherDoc;
  student: StudentDoc;
  parent: ParentDoc;
  subject: SubjectDoc;
  class: ClassDoc;
  exam: ExamDoc;
  assignment: AssignmentDoc;
  result: ResultDoc;
  attendance: AttendanceDoc;
  event: EventDoc;
  announcement: AnnouncementDoc;
};

interface TimetableEntry {
  id: string;
  name: string;
  type: "class" | "exam";
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  startTime: string;
  endTime: string;
  subject?: string;
  location?: string;
}
