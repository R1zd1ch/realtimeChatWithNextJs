import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// if (
//   !process.env.PUSHER_APP_ID ||
//   !process.env.NEXT_PUBLIC_PUSHER_APP_KEY ||
//   !process.env.PUSHER_APP_SECRET ||
//   !process.env.PUSHER_APP_CLUSTER
// ) {
console.log('Pusher App ID:', process.env.NEXT_PUBLIC_PUSHER_APP_ID);
console.log('Pusher App Key:', process.env.NEXT_PUBLIC_PUSHER_APP_KEY);
console.log('Pusher App Secret:', process.env.NEXT_PUBLIC_PUSHER_APP_SECRET);
console.log('Pusher App Cluster:', process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER);

// }

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID ?? '',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '',
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET ?? '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? '',
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? '',
});
