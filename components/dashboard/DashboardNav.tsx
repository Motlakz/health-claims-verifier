"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    BarChart2,
    Users,
    FileText,
    Settings,
} from "lucide-react"

const items = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: BarChart2,
    },
    {
        title: "Influencers",
        href: "/dashboard/influencers",
        icon: Users,
    },
    {
        title: "Claims Analysis",
        href: "/dashboard/claims",
        icon: FileText,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="grid items-start gap-2 text-lg">
            {items.map((item) => {
                const Icon = item.icon
                return (
                <Link key={item.href} href={item.href}>
                    <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Button>
                </Link>
                )
            })}
        </nav>
    )
}
