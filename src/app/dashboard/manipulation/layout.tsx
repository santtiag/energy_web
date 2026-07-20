import SectionHeader from '@/components/dashboard/SectionHeader';

export default function ManipulationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <SectionHeader slug="manipulation" />
            <div className="mt-8">{children}</div>
        </div>
    );
}
