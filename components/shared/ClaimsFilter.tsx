"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function ClaimsFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`?${params.toString()}`)
    }

    const getCurrentValue = (key: string) => {
        return searchParams.get(key) || "all"
    }

    return (
        <div className="flex gap-2">
            <Select 
                value={getCurrentValue('category')}
                onValueChange={(value) => updateFilter('category', value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="mentalhealth">Mental Health</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="sleep">Sleep</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="neuroscience">Neuroscience</SelectItem>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
            </Select>

            <Select 
                value={getCurrentValue('status')}
                onValueChange={(value) => updateFilter('status', value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="questionable">Questionable</SelectItem>
                    <SelectItem value="debunked">Debunked</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
