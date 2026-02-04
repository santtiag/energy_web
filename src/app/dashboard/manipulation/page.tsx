'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ManipulationPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/manipulation/upload');
    }, [router]);

    return null;
};

export default ManipulationPage;
