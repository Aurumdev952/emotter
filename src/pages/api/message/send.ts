import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/utils/db";
import { pusherServer } from "~/utils/pusher";
import { fetchRedis } from "~/utils/redis";
import { toPusherKey } from "~/utils/utils";
import { Message, messageValidator } from "~/utils/validator";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { text, chatId } = (await req.body) as {
      text: string;
      chatId: string;
    };
    const session = await getServerAuthSession({ req, res });

    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    // notify all connected chat room clients
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming-message",
      message
    );

    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      "new_message",
      {
        ...message,
        senderImg: sender.image,
        senderName: sender.name,
      }
    );

    // all valid, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
