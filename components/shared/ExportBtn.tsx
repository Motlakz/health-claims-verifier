/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ExportButtonProps {
    data: any[]
    filename?: string
}

const exportToCSV = (data: any[], filename: string = 'export') => {
    const headers = Object.keys(data[0])
    const csvContent = [
        headers.join(','),
        ...data.map(item => 
            headers.map(header => {
                const value = item[header]
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
            }).join(',')
        )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
}

const exportToJSON = (data: any[], filename: string = 'export') => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.json`
    link.click()
}

const exportToExcel = (data: any[], filename: string = 'export') => {
    const headers = Object.keys(data[0])
    const csvContent = [
        headers.join('\t'),
        ...data.map(item => 
            headers.map(header => item[header]).join('\t')
        )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.xls`
    link.click()
}

const exportToTXT = (data: any[], filename: string = 'export') => {
    const txtContent = data.map(item => 
        Object.entries(item)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
    ).join('\n\n---\n\n')

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.txt`
    link.click()
}

export function ExportButton({ data, filename = 'export' }: ExportButtonProps) {
    if (!data || data.length === 0) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <DownloadIcon className="h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportToCSV(data, filename)}>
                    Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToJSON(data, filename)}>
                    Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToExcel(data, filename)}>
                    Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToTXT(data, filename)}>
                    Export as TXT
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
