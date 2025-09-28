import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Conversations from "@/components/messages/Conversations";
import { getConversations } from "@/lib/actions/message.action";

const MessagesPage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const userId = session.user.id;

  const result = await getConversations({ userId });

  return (
    <div className="container mx-auto flex h-full gap-4 px-4 pt-16">
      <div className="flex h-full w-full items-center justify-start py-4">
        <div className="flex h-full w-full">
          <Conversations data={result.data!} />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
