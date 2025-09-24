"use client";

import { faker } from "@faker-js/faker";
import Image from "next/image";
import { useState } from "react";

import { roleColors } from "@/lib/utils";
import { Role } from "@/prisma/client";

import LocalSearch from "../search/LocalSearch";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  role: Role;
};

const dummyConversations: Conversation[] = Array.from({ length: 5 }).map(
  () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    lastMessage: faker.lorem.sentence(),
    unreadCount: faker.number.int({ min: 0, max: 5 }),
    role: ["ADMIN", "TEACHER", "STUDENT", "PARENT"][
      faker.number.int({ min: 0, max: 3 })
    ] as "ADMIN" | "TEACHER" | "STUDENT" | "PARENT",
  }),
);

const Conversations = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleNewMessage = () => {
    alert("Open New Message Modal"); // replace with modal logic later
  };

  return (
    <div className="bg-sidebar flex h-full w-64 flex-col rounded-l-xl border">
      <div className="p-4">
        <Button
          onClick={handleNewMessage}
          className="w-full"
          variant={"outline"}
        >
          + New Message
        </Button>
      </div>

      <Separator />

      {/* Search */}
      <div className="px-4">
        <LocalSearch route="/messages" />
      </div>

      <Separator />

      {/* Conversation List */}
      <div className="flex-1">
        {dummyConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedId(conv.id)}
            className={`hover:bg-accent flex cursor-pointer items-center gap-3 px-4 py-3 ${
              selectedId === conv.id ? "bg-cyan-500" : ""
            }`}
          >
            <Image
              src={conv.avatar}
              alt={conv.name}
              width={40}
              height={40}
              className={`rounded-full border-2 ${roleColors[conv.role]}`}
            />
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="text-foreground truncate text-sm font-medium">
                  {conv.name}
                </h4>
                {conv.unreadCount > 0 && (
                  <span className="text-foreground size-5 rounded-full bg-blue-500 py-0.5 text-center text-xs">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-foreground truncate text-sm">
                {conv.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
