"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheckIcon, CheckIcon, LoaderIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { getConversationById, sendMessage } from "@/lib/actions/message.action";
import { formatMessageDate } from "@/lib/utils";
import { SendMessageSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

interface ChatWindowProps {
  conversationId: string | null;
  receiverId?: string;
  onClose: () => void;
  onMessageSent?: (convId: string, newMessage: MessageDoc) => void;
}

const ChatWindow = ({
  conversationId,
  receiverId,
  onClose,
  onMessageSent,
}: ChatWindowProps) => {
  const session = useSession();
  const userId = session.data?.user.id || "";

  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [isFetching, startFetching] = useTransition();
  const [isSending, startSending] = useTransition();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      startFetching(async () => {
        const result = await getConversationById({ id: conversationId });
        if (result.success) setMessages(result.data?.messages || []);
      });
    } else {
      setMessages([]);
    }
  }, [conversationId, userId]);

  const isOwn = (message: MessageDoc, userId: string): boolean => {
    return message.senderId === userId;
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const form = useForm<z.infer<typeof SendMessageSchema>>({
    resolver: zodResolver(SendMessageSchema),
    defaultValues: {
      senderId: userId,
      content: "",
    },
  });

  useEffect(() => {
    form.setValue("conversationId", conversationId || undefined);
    if (receiverId) form.setValue("receiverId", receiverId);
  }, [conversationId, form, receiverId]);

  const handleSend = async (data: z.infer<typeof SendMessageSchema>) => {
    startSending(async () => {
      const result = await sendMessage({
        ...data,
        receiverId: receiverId!,
        conversationId: conversationId!,
      });

      if (result.success) {
        setMessages((prev) => [...prev, result.data?.message]);
        form.reset({ ...form.getValues(), content: "" });
        onMessageSent?.(conversationId!, result.data?.message);
        toast.success("Success", {
          description: "Message sent successfully.",
        });
      } else {
        toast.error(`Error ${result.status}`, {
          description: result.error?.message || "Something went wrong.",
        });
      }
    });
  };

  return (
    <div className="bg-sidebar flex h-full flex-1 flex-col rounded-r-xl border border-l-0">
      {isFetching ? (
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
                        ? "bg-primary text-white"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {own ? (
                      <p className="text-sm">You</p>
                    ) : (
                      <p className="text-sm text-gray-700">{msg.sender.name}</p>
                    )}
                    <p>{msg.content}</p>
                    <p
                      className={`flex items-center justify-end gap-1 text-xs ${
                        own ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {formatMessageDate(msg.createdAt)}
                      {own &&
                        (msg.readAt ? (
                          <CheckCheckIcon className="size-4 text-emerald-400" />
                        ) : (
                          <CheckIcon className="size-4 text-gray-400" />
                        ))}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {conversationId && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSend)}
                className="flex items-center gap-2 border-t px-4 py-3"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Type your message..."
                          className="no-focus rounded-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSending || !form.watch("content").trim()}
                  className="rounded-full text-sm"
                >
                  {isSending ? (
                    <>
                      <LoaderIcon className="mr-2 size-3 animate-spin" />
                    </>
                  ) : (
                    <>Send</>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </>
      )}
    </div>
  );
};

export default ChatWindow;
