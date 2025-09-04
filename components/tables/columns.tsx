"use client";

import { ColumnDef, CoreRow } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getTeacherColumns = (role: string): ColumnDef<TeacherDoc>[] => [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Image
          src={row.original.image || "/images/noAvatar.png"}
          alt={row.original.name}
          width={32}
          height={32}
          className="rounded-full object-contain"
        ></Image>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full cursor-pointer !pl-0"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link href={`/teachers/${row.original.userId}`}>{row.original.name}</Link>
    ),
  },
  {
    accessorKey: "employeeId",
    header: "Teacher ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full cursor-pointer !pl-0"
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
  },
  {
    accessorKey: "classes",
    header: "Classes",
  },
  ...(role === "ADMIN" || role === "TEACHER"
    ? [
        {
          accessorKey: "phone",
          header: "Phone",
        },
        {
          accessorKey: "address",
          header: "Address",
        },
      ]
    : []),
  ...(role === "ADMIN"
    ? [
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
                <DropdownMenuItem>Edit Teacher</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]
    : []),
];
