'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AnalysisPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/analysis/smoothers');
    }, [router]);

    return null;
};

export default AnalysisPage;
