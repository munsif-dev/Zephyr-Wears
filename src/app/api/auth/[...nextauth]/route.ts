import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handlers} from '@/lib/auth';

export const {GET, POST} = handlers;