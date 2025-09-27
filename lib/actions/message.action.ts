"use server";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import {
  GetConversationByIdSchema,
  GetConversationsSchema,
} from "../validations";

export async function getConversations(params: { userId: string }): Promise<
  ActionResponse<{
    conversations: ConversationDoc[];
    totalConversations: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetConversationsSchema,
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  const where: Prisma.ConversationWhereInput = {
    OR: [{ user1Id: userId }, { user2Id: userId }],
  };

  const orderBy: Prisma.ConversationOrderByWithRelationInput = {
    updatedAt: "desc",
  };

  try {
    const totalConversations = await prisma.conversation.count({ where });

    const conversations = await prisma.conversation.findMany({
      where,
      orderBy,
      include: {
        user1: { select: { id: true, name: true, image: true, role: true } },
        user2: { select: { id: true, name: true, image: true, role: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    const formatted = conversations.map((conv) => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
      return {
        id: conv.id,
        otherUser,
        lastMessage: conv.messages[0] ?? null,
        updatedAt: conv.updatedAt,
      };
    });

    return {
      success: true,
      data: {
        conversations: formatted,
        totalConversations,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getConversationById(params: { id: string }): Promise<
  ActionResponse<{
    messages: MessageDoc[];
    totalMessages: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetConversationByIdSchema,
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  if (!id) {
    return {
      success: true,
      data: {
        messages: [],
        totalMessages: 0,
      },
    };
  }

  const where: Prisma.MessageWhereInput = {
    OR: [{ conversationId: id }],
  };

  const orderBy: Prisma.MessageOrderByWithRelationInput = {
    createdAt: "asc",
  };

  try {
    const totalMessages = await prisma.message.count({ where });

    const messages = await prisma.message.findMany({
      where,
      orderBy,
      include: {
        sender: {
          select: { id: true, name: true, image: true, role: true },
        },
      },
    });

    return {
      success: true,
      data: {
        messages,
        totalMessages,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
