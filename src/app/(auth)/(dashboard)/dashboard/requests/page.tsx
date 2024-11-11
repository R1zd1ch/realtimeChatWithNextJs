import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helpers/redis';
import { handler } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

const page = async ({}) => {
  const session = await getServerSession(handler);
  if (!session) {
    notFound();
  }
  console.log(session);

  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`,
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;
      return {
        senderId,
        senderEmail: senderParsed.email,
        senderName: senderParsed.name,
        senderImage: senderParsed.image as string,
      };
    }),
  );
  return (
    <div className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </div>
  );
};

export default page;
