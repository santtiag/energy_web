import SectionHeader from '@/components/dashboard/SectionHeader';

export default function DataLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <SectionHeader slug="data" />
            <div className="mt-8">{children}</div>
        </div>
    );
}
