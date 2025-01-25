import { DashboardNav } from "@/components/dashboard/DashboardNav"
import { UserNav } from "@/components/dashboard/UserNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <header className="sticky top-0 z-40 border-b bg-background px-4">
                <div className="flex h-16 items-center justify-between py-4">
                    <div className="flex gap-6 md:gap-10">
                        <h1 className="font-bold">Health Claims Verifier</h1>
                    </div>
                    <UserNav />
                </div>
            </header>
            <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex">
                    <DashboardNav />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
