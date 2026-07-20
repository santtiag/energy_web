'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CommandPaletteProvider } from '@/components/dashboard/CommandPaletteProvider';
import CommandPalette from '@/components/dashboard/CommandPalette';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <CommandPaletteProvider>
                <div className="min-h-dvh bg-background">
                    <DashboardHeader />
                    <main className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10">
                        {children}
                    </main>
                    <CommandPalette />
                </div>
            </CommandPaletteProvider>
        </ProtectedRoute>
    );
}
