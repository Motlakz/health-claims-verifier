"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { HealthClaim } from "@/types"
import { ExportButton } from "@/components/shared/ExportBtn"

interface ClaimsListProps {
    claims: HealthClaim[]
}

export function ClaimsList({ claims }: ClaimsListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [filteredClaims, setFilteredClaims] = useState<HealthClaim[]>(claims)
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentClaims = filteredClaims.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredClaims.length / itemsPerPage)

    useEffect(() => {
        const search = searchParams.get('search')?.toLowerCase()
        const category = searchParams.get('category')?.toLowerCase()
        const status = searchParams.get('status')?.toLowerCase()
        const page = parseInt(searchParams.get('page') || '1')
        
        let filtered = [...claims]

        if (search) {
            filtered = filtered.filter(claim => 
                claim.content.toLowerCase().includes(search)
            )
        }

        if (category) {
            filtered = filtered.filter(claim => 
                claim.category.toLowerCase() === category
            )
        }

        if (status) {
            filtered = filtered.filter(claim => 
                claim.verificationStatus.toLowerCase() === status
            )
        }

        setFilteredClaims(filtered)
        setCurrentPage(page)
    }, [searchParams, claims])

    const handleRowClick = (claim: HealthClaim) => {
        const encodedClaimData = encodeURIComponent(JSON.stringify(claim))
        router.push(`/dashboard/claims/${claim.id}?claimData=${encodedClaimData}`)
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('page', pageNumber.toString())
        const search = current.toString()
        const query = search ? `?${search}` : ""
        router.push(`${window.location.pathname}${query}`)
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('page', '1')
        current.set('per_page', value)
        const search = current.toString()
        const query = search ? `?${search}` : ""
        router.push(`${window.location.pathname}${query}`)
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Recent Claims</CardTitle>
                    <div className="flex items-center space-x-2">
                        <ExportButton 
                            data={filteredClaims} 
                            filename="health_claims"
                        />
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Rows per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 per page</SelectItem>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Claim</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Trust Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentClaims.map((claim) => (
                                <TableRow 
                                    key={claim.id}
                                    onClick={() => handleRowClick(claim)}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium max-w-md truncate">
                                        {claim.content}
                                    </TableCell>
                                    <TableCell>{claim.category}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                claim.verificationStatus === "Verified"
                                                    ? "default"
                                                    : claim.verificationStatus === "Questionable"
                                                    ? "secondary"
                                                    : "destructive"
                                            }
                                        >
                                            {claim.verificationStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{claim.trustScore}%</TableCell>
                                </TableRow>
                            ))}
                            {filteredClaims.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No claims found matching your criteria
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredClaims.length > 0 && (
                <div className="flex items-center justify-between space-x-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClaims.length)} of {filteredClaims.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
