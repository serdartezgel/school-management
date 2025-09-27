"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { roleColors } from "@/lib/utils";

import ChatWindow from "./ChatWindow";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const Conversations = ({
  data = { conversations: [], totalConversations: 0 },
}: {
  data: { conversations: ConversationDoc[]; totalConversations: number };
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewMessage = () => {
    alert("Open New Message Modal"); // replace with modal logic later
  };

  const filteredConversations = useMemo(() => {
    return data.conversations.filter((conv) =>
      conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data.conversations, searchTerm]);

  return (
    <>
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
        <div className="bg-sidebar m-4 flex max-w-sm items-center rounded-xl border-2 px-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!bg-sidebar no-focus w-sm border-none p-0 shadow-none outline-none"
          />
          <Image
            src={"/images/search.png"}
            alt="Search"
            width={20}
            height={20}
          />
        </div>

        <Separator />

        {/* Conversation List */}
        <div className="flex-1">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`hover:bg-accent flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 ${
                selectedId === conv.id ? "bg-cyan-500" : ""
              }`}
            >
              <Image
                src={conv.otherUser.avatar || "/images/avatar.png"}
                alt={conv.otherUser.name}
                width={40}
                height={40}
                className={`rounded-full border-2 ${roleColors[conv.otherUser.role]}`}
              />
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h4 className="text-foreground truncate text-sm font-medium">
                    {conv.otherUser.name}
                  </h4>
                  {/* {conv.unreadCount > 0 && (
                    <span className="text-foreground size-5 rounded-full bg-blue-500 py-0.5 text-center text-xs">
                      {conv.unreadCount}
                    </span>
                  )} */}
                </div>
                <p className="text-foreground truncate text-sm">
                  {conv.lastMessage.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-full flex-1">
        <ChatWindow
          conversationId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </>
  );
};

export default Conversations;
