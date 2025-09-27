"use client";

import { LoaderIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { startTransition, useEffect, useRef, useState } from "react";

import { getConversationById } from "@/lib/actions/message.action";
import { formatMessageDate } from "@/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatWindowProps {
  conversationId: string | null;
  onClose: () => void;
}

const ChatWindow = ({ conversationId, onClose }: ChatWindowProps) => {
  const session = useSession();
  const userId = session.data?.user.id || "";

  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages whenever conversation changes
  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      startTransition(async () => {
        const result = await getConversationById({ id: conversationId });
        if (result.success) setMessages(result.data?.messages || []);
        setLoading(false);
      });
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const isOwn = (message: MessageDoc, userId: string): boolean => {
    return message.senderId === userId;
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {};

  console.log(messages);

  return (
    <div className="bg-sidebar flex h-full flex-1 flex-col rounded-r-xl border border-l-0">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <LoaderIcon className="size-6 animate-spin" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-foreground py-1.5 font-medium">
              {messages.length > 0
                ? messages.find((msg) => !isOwn(msg, userId))?.sender.name ||
                  "Chat"
                : "Chat"}
            </h2>

            {messages.length > 0 && (
              <Button
                variant={"ghost"}
                onClick={onClose}
                title="Close"
                className="cursor-pointer"
              >
                <XIcon className="size-6" />
              </Button>
            )}
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg) => {
              const own = isOwn(msg, userId);
              return (
                <div
                  key={msg.id}
                  className={`flex ${own ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[60%] rounded-xl px-4 py-2 ${
                      own
                        ? "bg-cyan-500 text-gray-100"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {own ? (
                      <p className="font-medium">You</p>
                    ) : (
                      <p className="font-medium text-gray-700">
                        {msg.sender.name}
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    {own ? (
                      <span className="block text-right text-xs text-gray-300">
                        {formatMessageDate(msg.createdAt)}
                      </span>
                    ) : (
                      <span className="block text-right text-xs text-gray-400">
                        {formatMessageDate(msg.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t px-4 py-3">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1 rounded-xl border px-4 py-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="rounded-full bg-cyan-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
