import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth';

export default async function Home() {
    const { isAuthenticated } = await verifyAuth();
    redirect(isAuthenticated ? '/dashboard' : '/login');
}
