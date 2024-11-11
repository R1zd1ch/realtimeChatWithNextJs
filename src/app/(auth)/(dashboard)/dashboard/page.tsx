import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { handler } from '@/lib/auth';
import { chatHrefConstructor } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import { ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import { FC } from 'react';

const Dashboard: FC = async ({}) => {
  const session = await getServerSession(handler);

  if (!session) {
    notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);

  const friendLastMessages = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1,
      )) as string[];
      const lastMessage = JSON.parse(lastMessageRaw) as Message;
      return {
        ...friend,
        lastMessage,
      };
    }),
  );

  console.log(session);
  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendLastMessages.length === 0 ? (
        <p className="text-sm text-zinc-500">Нечего показывать здесь...</p>
      ) : (
        friendLastMessages.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400"></ChevronRight>
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    fill
                    src={friend.image || ''}
                    alt={friend.name}
                    className="rounded-full"
                  ></Image>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zin-400">
                    {friend.lastMessage?.senderId === session.user.id ? 'You: ' : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
