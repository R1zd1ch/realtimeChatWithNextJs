import NextAuth from 'next-auth';
import { handler } from '@/lib/auth'; // предполагается, что authOptions экспортирован в отдельном файле

const handle = NextAuth(handler);

export { handle as GET, handle as POST };
