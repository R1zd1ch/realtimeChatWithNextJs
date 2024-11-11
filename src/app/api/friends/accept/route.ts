import { fetchRedis } from '@/helpers/redis';
import { handler } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(handler);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd,
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response('Already friends', { status: 400 });
    }

    const hasFriendRequest = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd,
    )) as 0 | 1;

    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 });
    }

    pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), 'new_friend', {
      senderId: session.user.id,
      senderEmail: session.user.email,
      senderName: session.user.name,
      senderImage: session.user.image as string,
    });

    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    await db.sadd(`user:${session.user.id}:friends`, idToAdd);

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
