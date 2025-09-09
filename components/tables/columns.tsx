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
        ></Image>
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
        value: searchParams.get("sort") === "desc" ? "asc" : "desc",
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
      <Link href={`/teachers/${row.original.userId}`}>
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
  },
  {
    accessorKey: "classes",
    header: "Classes",
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
