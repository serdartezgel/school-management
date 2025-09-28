"use client";

import { useSession } from "next-auth/react";
import { startTransition, useState } from "react";

import { getAllUsersByRole } from "@/lib/actions/user.action";
import { Role } from "@/prisma/client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

const NewMessageModal = () => {
  const session = useSession();

  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const userId = session.data?.user.id;
  const userRole = session.data?.user.role;

  const getUsers = async () => {
    if (!userId || !userRole) return;

    setLoading(true);
    startTransition(async () => {
      const result = await getAllUsersByRole({ userId, userRole });
      setUsers(result.data?.users || []);
      setLoading(false);
    });
  };

  const toggleUser = (id: string) => {
    if (userRole === "STUDENT" || userRole === "PARENT") {
      setSelectedUsers([id]);
    } else {
      setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
      );
    }
  };

  const toggleRoleGroup = (role: Role) => {
    const roleUserIds = users.filter((u) => u.role === role).map((u) => u.id);

    const allSelected = roleUserIds.every((id) => selectedUsers.includes(id));

    if (allSelected) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !roleUserIds.includes(id)),
      );
    } else {
      setSelectedUsers((prev) => [
        ...prev,
        ...roleUserIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleAllUsers = () => {
    const allSelected = users.every((u) => selectedUsers.includes(u.id));
    if (allSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const isAllUsersSelected =
    users.length > 0 && users.every((u) => selectedUsers.includes(u.id));

  const isRoleGroupSelected = (role: Role) => {
    const roleUserIds = users.filter((u) => u.role === role).map((u) => u.id);
    return (
      roleUserIds.length > 0 &&
      roleUserIds.every((id) => selectedUsers.includes(id))
    );
  };

  const topOptions =
    userRole === "ADMIN"
      ? [
          { id: "all-users", label: "All Users" },
          { id: "all-teachers", label: "All Teachers", role: Role.TEACHER },
          { id: "all-students", label: "All Students", role: Role.STUDENT },
          { id: "all-parents", label: "All Parents", role: Role.PARENT },
        ]
      : userRole === "TEACHER"
        ? [
            { id: "all-students", label: "All Students", role: Role.STUDENT },
            { id: "all-parents", label: "All Parents", role: Role.PARENT },
          ]
        : [];

  const groupedUsers: Record<string, UserDoc[]> = users.reduce(
    (acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    },
    {} as Record<string, UserDoc[]>,
  );

  console.log(users);
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) getUsers();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full" variant={"outline"}>
          + New Message
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-y-auto md:max-w-3xl">
        <DialogDescription className="sr-only" />

        <DialogHeader>
          <DialogTitle>
            <p className="text-xl font-semibold">New Message</p>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
          <div className="flex w-1/2 flex-col gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer justify-start truncate text-gray-500"
                >
                  {loading
                    ? "Loading..."
                    : selectedUsers.length
                      ? `${selectedUsers.length} selected`
                      : "Select Users"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="max-h-60 min-w-[300px] overflow-y-auto">
                {topOptions.length > 0 && (
                  <>
                    <DropdownMenuLabel>Quick Select</DropdownMenuLabel>
                    <Separator />
                  </>
                )}
                {topOptions.map((opt) => {
                  const isSelected =
                    opt.id === "all-users"
                      ? isAllUsersSelected
                      : isRoleGroupSelected(opt.role!);

                  return (
                    <DropdownMenuItem
                      key={opt.id}
                      onSelect={(e) => {
                        e.preventDefault();
                        if (opt.id === "all-users") {
                          toggleAllUsers();
                        } else {
                          toggleRoleGroup(opt.role!);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {isSelected ? "✅ " : "☐ "}
                      {opt.label}
                    </DropdownMenuItem>
                  );
                })}

                <Separator />

                {Object.entries(groupedUsers).map(([role, users]) => (
                  <div key={role}>
                    <DropdownMenuLabel className="mt-2">
                      {role}S
                    </DropdownMenuLabel>
                    <Separator />
                    {users.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onSelect={(e) => {
                          e.preventDefault();
                          toggleUser(user.id);
                        }}
                        className="cursor-pointer"
                      >
                        {selectedUsers.includes(user.id) ? "✅ " : "☐ "}
                        {user.name}
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedUsers.length > 0 && (
              <div className="mt-2 w-full">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Selected Users:
                </p>
                <div className="flex flex-wrap gap-2">
                  {users
                    .filter((u) => selectedUsers.includes(u.id))
                    .map((u) => (
                      <Button
                        variant={"outline"}
                        key={u.id}
                        onClick={() => toggleUser(u.id)}
                        className="cursor-pointer rounded-full px-2 py-1 text-xs"
                      >
                        {u.name}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <Textarea
            placeholder="Your message"
            className="h-full w-full md:w-1/2"
          />
        </div>

        <DialogFooter className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button variant="outline" className="">
              Cancel
            </Button>
          </DialogClose>

          <Button className="rounded-md bg-cyan-600 text-white hover:bg-cyan-500">
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;
