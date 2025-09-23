"use client";

import { ColumnDef, CoreRow } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReadonlyURLSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formUrlQuery } from "@/lib/url";

import FormContainer from "../forms/FormContainer";
import { AttendanceStatusSelect } from "./cells/AttendanceStatusSelect";

export const getTeacherColumns = (
  role: string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): ColumnDef<TeacherDoc>[] => [
  {
    accessorFn: (row) => row.user.image,
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Image
          src={row.original.user.image || "/images/noAvatar.png"}
          alt={row.original.user.name || ""}
          width={32}
          height={32}
          className="rounded-full object-contain"
        />
      </div>
    ),
  },
  {
    accessorFn: (row) => row.user.name,
    id: "name",
    header: () => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "sort",
        value: searchParams.get("sort") === "asc" ? "desc" : "asc",
        pathname,
      });
      return (
        <Link href={newUrl}>
          <Button
            variant={"ghost"}
            className="w-full cursor-pointer justify-between !pl-0"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => (
      <Link
        href={`/teachers/${row.original.userId}`}
        className="hover:underline"
      >
        {row.original.user.name}
      </Link>
    ),
  },
  {
    accessorKey: "employeeId",
    header: "Teacher ID",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => {
      const subjects = row.original.subjects || [];

      if (subjects.length === 0)
        return <span className="text-gray-500">No subject</span>;
      return (
        <div className="flex flex-col gap-1">
          {subjects.map((subject: SubjectDoc) => (
            <Link
              href={`/subjects/${subject.id}`}
              key={subject.id}
              className="hover:underline"
            >
              {subject.subject.name}
            </Link>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "classes",
    header: "Classes",
    cell: ({ row }) => {
      const classes = row.original.classes || [];

      if (classes.length === 0)
        return <span className="text-gray-500">No subject</span>;
      return (
        <div className="flex flex-col gap-1">
          {classes.map((classData: ClassDoc) => (
            <Link
              href={`/classes/${classData.id}`}
              key={classData.id}
              className="hover:underline"
            >
              {classData.class.name}
            </Link>
          ))}
        </div>
      );
    },
  },
  ...(role === "ADMIN"
    ? [
        {
          accessorKey: "user.phone",
          header: "Phone",
        },
        {
          accessorKey: "user.address",
          header: "Address",
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }: { row: CoreRow<TeacherDoc> }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="sr-only">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link href={`/teachers/${row.original.userId}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  {role === "ADMIN" && (
                    <FormContainer
                      table="teacher"
                      type="update"
                      data={row.original}
                    />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]
    : []),
];

export const getStudentColumns = (
  role: string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): ColumnDef<StudentDoc>[] => [
  {
    accessorFn: (row) => row.user.image,
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Image
          src={row.original.user.image || "/images/noAvatar.png"}
          alt={row.original.user.name || ""}
          width={32}
          height={32}
          className="rounded-full object-contain"
        />
      </div>
    ),
  },
  {
    accessorFn: (row) => row.user.name,
    id: "name",
    header: () => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "sort",
        value: searchParams.get("sort") === "asc" ? "desc" : "asc",
        pathname,
      });
      return (
        <Link href={newUrl}>
          <Button
            variant={"ghost"}
            className="w-full cursor-pointer justify-between !pl-0"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => (
      <Link
        href={`/students/${row.original.userId}`}
        className="hover:underline"
      >
        {row.original.user.name}
      </Link>
    ),
  },
  {
    accessorKey: "studentId",
    header: "Student ID",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorFn: (row) => row.class.name,
    id: "class",
    header: "Class",
    cell: ({ row }) => (
      <Link
        href={`/classes/${row.original.class.id}`}
        className="hover:underline"
      >
        {row.original.class.name}
      </Link>
    ),
  },
  {
    accessorFn: (row) => row.parent.user.name,
    id: "parentName",
    header: "Parent Name",
    cell: ({ row }) => (
      <Link
        href={`/students/${row.original.userId}`}
        className="hover:underline"
      >
        {row.original.user.name}
      </Link>
    ),
  },
  {
    accessorKey: "emergencyContact",
    header: "Emergency Contact",
  },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
  },
  ...(role === "ADMIN"
    ? [
        {
          accessorKey: "user.phone",
          header: "Phone",
        },
        {
          accessorKey: "user.address",
          header: "Address",
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }: { row: CoreRow<StudentDoc> }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="sr-only">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link href={`/students/${row.original.userId}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  {role === "ADMIN" && (
                    <FormContainer
                      table="student"
                      type="update"
                      data={row.original}
                    />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]
    : []),
];

export const getClassColumns = (
  role: string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): ColumnDef<ClassDoc>[] => {
  const makeSortableHeader = (key: string, label: string) => {
    const currentSort = searchParams.get("sort") || "asc";
    const currentSortBy = searchParams.get("sortBy") || "name";

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "sort",
      value: currentSortBy === key && currentSort === "asc" ? "desc" : "asc",
      pathname,
    });

    const urlWithSortBy = formUrlQuery({
      params: newUrl.split("?")[1],
      key: "sortBy",
      value: key,
      pathname,
    });

    return (
      <Link href={urlWithSortBy}>
        <Button
          variant={"ghost"}
          className="w-full cursor-pointer justify-between !pl-0"
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    );
  };
  return [
    {
      accessorFn: (row) => row.name,
      id: "name",
      header: () => makeSortableHeader("name", "Name"),
      cell: ({ row }) => (
        <Link href={`/classes/${row.original.id}`} className="hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "grade",
      header: () => makeSortableHeader("grade", "Grade"),
    },
    {
      accessorKey: "section",
      header: "Section",
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
    },
    {
      accessorKey: "academicYear.year",
      header: () => makeSortableHeader("academicYear", "Academic Year"),
    },
    ...(role === "ADMIN"
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: CoreRow<StudentDoc> }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="sr-only">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href={`/classes/${row.original.id}`}>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    {role === "ADMIN" && (
                      <FormContainer
                        table="class"
                        type="update"
                        data={row.original}
                      />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]
      : []),
  ];
};

export const getParentColumns = (
  role: string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): ColumnDef<ParentDoc>[] => [
  {
    accessorFn: (row) => row.user.image,
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Image
          src={row.original.user.image || "/images/noAvatar.png"}
          alt={row.original.user.name || ""}
          width={32}
          height={32}
          className="rounded-full object-contain"
        />
      </div>
    ),
  },
  {
    accessorFn: (row) => row.user.name,
    id: "name",
    header: () => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "sort",
        value: searchParams.get("sort") === "asc" ? "desc" : "asc",
        pathname,
      });
      return (
        <Link href={newUrl}>
          <Button
            variant={"ghost"}
            className="w-full cursor-pointer justify-between !pl-0"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => (
      <Link
        href={`/parents/${row.original.userId}`}
        className="hover:underline"
      >
        {row.original.user.name}
      </Link>
    ),
  },
  {
    id: "children",
    header: "Children",
    cell: ({ row }) => {
      const children = row.original.children || [];

      if (children.length === 0)
        return <span className="text-gray-500">No children</span>;
      return (
        <div className="flex flex-col gap-1">
          {children.map((child: StudentDoc) => (
            <Link
              href={`/students/${child.id}`}
              key={child.id}
              className="hover:underline"
            >
              {child.user.name}
            </Link>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "occupation",
    header: "Occupation",
  },
  ...(role === "ADMIN"
    ? [
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }: { row: CoreRow<StudentDoc> }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="sr-only">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link href={`/classes/${row.original.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  {role === "ADMIN" && (
                    <FormContainer
                      table="parent"
                      type="update"
                      data={row.original}
                    />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]
    : []),
];

export const getSubjectColumns = (
  role: string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): ColumnDef<SubjectDoc>[] => {
  const makeSortableHeader = (key: string, label: string) => {
    const currentSort = searchParams.get("sort") || "asc";
    const currentSortBy = searchParams.get("sortBy") || "name";

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "sort",
      value: currentSortBy === key && currentSort === "asc" ? "desc" : "asc",
      pathname,
    });

    const urlWithSortBy = formUrlQuery({
      params: newUrl.split("?")[1],
      key: "sortBy",
      value: key,
      pathname,
    });

    return (
      <Link href={urlWithSortBy}>
        <Button
          variant={"ghost"}
          className="w-full cursor-pointer justify-between !pl-0"
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    );
  };
  return [
    {
      accessorFn: (row) => row.name,
      id: "name",
      header: () => makeSortableHeader("name", "Name"),
      cell: ({ row }) => (
        <Link href={`/subjects/${row.original.id}`} className="hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "code",
      header: () => makeSortableHeader("code", "Subject Code"),
    },
    {
      accessorKey: "credits",
      header: () => makeSortableHeader("credits", "Credits"),
    },
    {
      accessorKey: "academicYear.year",
      header: () => makeSortableHeader("academicYear", "Academic Year"),
    },
    ...(role === "ADMIN"
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: CoreRow<StudentDoc> }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="sr-only">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href={`/subjects/${row.original.id}`}>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    {role === "ADMIN" && (
                      <FormContainer
                        table="subject"
                        type="update"
                        data={row.original}
                      />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]
      : []),
  ];
};

export const getAttendanceColumns = (
  role: string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): ColumnDef<StudentWithAttendanceDoc>[] => {
  const makeSortableHeader = (key: string, label: string) => {
    const currentSort = searchParams.get("sort") || "asc";
    const currentSortBy = searchParams.get("sortBy") || "name";

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "sort",
      value: currentSortBy === key && currentSort === "asc" ? "desc" : "asc",
      pathname,
    });

    const urlWithSortBy = formUrlQuery({
      params: newUrl.split("?")[1],
      key: "sortBy",
      value: key,
      pathname,
    });

    return (
      <Link href={urlWithSortBy}>
        <Button
          variant={"ghost"}
          className="w-full cursor-pointer justify-between !pl-0"
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    );
  };
  return [
    {
      accessorFn: (row) => row.user.image,
      id: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Image
            src={row.original.user.image || "/images/noAvatar.png"}
            alt={row.original.user.name || ""}
            width={32}
            height={32}
            className="rounded-full object-contain"
          />
        </div>
      ),
    },
    {
      accessorFn: (row) => row.user.name,
      id: "name",
      header: () => makeSortableHeader("name", "Name"),
      cell: ({ row }) => (
        <Link href={`/students/${row.original.user.id}`} className="underline">
          {row.original.user.name}
        </Link>
      ),
    },
    {
      accessorKey: "studentId",
      header: "Student ID",
    },
    {
      accessorKey: "classSubject.class.name",
      header: () => makeSortableHeader("class", "Class"),
      cell: ({ row }) => (
        <Link
          href={`/classes/${row.original.classSubject.class.id}`}
          className="hover:underline"
        >
          {row.original.classSubject.class.name}
        </Link>
      ),
    },
    {
      accessorKey: "classSubject.subject.name",
      header: () => makeSortableHeader("subject", "Subject"),
      cell: ({ row }) => (
        <Link
          href={`/subjects/${row.original.classSubject.subject.id}`}
          className="hover:underline"
        >
          {row.original.classSubject.subject.name}
        </Link>
      ),
    },
    {
      accessorKey: "classSubject.teacher.user.name",
      header: () => makeSortableHeader("teacher", "Teacher"),
      cell: ({ row }) => (
        <Link
          href={`/teachers/${row.original.classSubject.teacher.id}`}
          className="hover:underline"
        >
          {row.original.classSubject.teacher.user.name}
        </Link>
      ),
    },
    {
      accessorKey: "attendanceStatus",
      header: "Attendance Status",
      cell: ({ row }) => <AttendanceStatusSelect attendance={row.original} />,
    },
  ];
};
