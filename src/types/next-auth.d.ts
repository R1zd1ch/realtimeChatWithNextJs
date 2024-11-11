// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Session, User } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId;
    };
  }
}
