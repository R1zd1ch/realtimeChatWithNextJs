import { chatHrefConstructor, cn } from '@/lib/utils';
import Link from 'next/link';
import { FC } from 'react';
import toast, { Toast } from 'react-hot-toast';
import Image from 'next/image';

interface unseenChatToastProps {
  t: Toast;
  senderId: string;
  sessionId: string;
  senderImg: string;
  senderName: string;
  senderMessage: string;
}

const unseenChatToast: FC<unseenChatToastProps> = ({
  t,
  senderId,
  sessionId,
  senderImg,
  senderName,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
        {
          'animate-enter': t.visible,
          'animate-leave': !t.visible,
        },
      )}
    >
      <Link
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={senderImg}
                alt={`${senderId} profile picture`}
              ></Image>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium text-gray-900>`}>{senderName}</p>
            <p className="mt-1 text-sm text-gray-500">{senderMessage}</p>
          </div>
        </div>
      </Link>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default unseenChatToast;
