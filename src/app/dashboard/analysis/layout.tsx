import SectionHeader from '@/components/dashboard/SectionHeader';

export default function AnalysisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <SectionHeader slug="analysis" />
            <div className="mt-8">{children}</div>
        </div>
    );
}
