"use client";

import { faker } from "@faker-js/faker";
import { useEffect, useRef, useState } from "react";

import { Input } from "../ui/input";

type Message = {
  id: string;
  sender: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
};

// Dummy messages generator
const generateDummyMessages = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    id: faker.string.uuid(),
    sender: faker.person.fullName(),
    content: faker.lorem.sentence(),
    isOwn: i % 2 === 0,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

const ChatWindow = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages whenever conversation changes
  useEffect(() => {
    const loadedMessages = generateDummyMessages(); // replace with API fetch
    setMessages(loadedMessages);
  }, [conversationId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: faker.string.uuid(),
      sender: "You",
      content: newMessage,
      isOwn: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="bg-sidebar flex h-full flex-1 flex-col rounded-r-xl border border-l-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-foreground font-medium">Message Sender</h2>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[60%] rounded-xl px-4 py-2 ${
                msg.isOwn
                  ? "bg-cyan-500 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.isOwn ? (
                <p className="font-medium">You</p>
              ) : (
                <p className="font-medium text-gray-700">{msg.sender}</p>
              )}
              <p className="text-sm">{msg.content}</p>
              {msg.isOwn ? (
                <span className="block text-right text-xs text-gray-300">
                  {msg.timestamp}
                </span>
              ) : (
                <span className="block text-right text-xs text-gray-400">
                  {msg.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default ChatWindow;
