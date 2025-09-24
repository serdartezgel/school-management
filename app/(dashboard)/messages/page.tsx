import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ChatWindow from "@/components/messages/ChatWindow";
import Conversations from "@/components/messages/Conversations";

const MessagesPage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="container mx-auto flex h-full gap-4 px-4 pt-16">
      <div className="flex h-full w-full items-center justify-start py-4">
        <div className="h-full w-64">
          <Conversations />
        </div>
        <div className="h-full flex-1">
          <ChatWindow conversationId="1" />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
