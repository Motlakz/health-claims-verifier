"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('search', value)
        } else {
            params.delete('search')
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search claims..."
                className="pl-8 w-full"
                defaultValue={searchParams.get('search') ?? ''}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    )
}
