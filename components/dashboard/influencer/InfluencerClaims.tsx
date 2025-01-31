"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSearchParams } from "next/navigation"
import { HealthClaim } from "@/types"
import { ExportButton } from "@/components/shared/ExportBtn"
import { Skeleton } from "@/components/ui/skeleton"
import ClaimsCard from "../claims/ClaimsCard"

interface InfluencerClaimsGridProps {
    claims: HealthClaim[]
    influencerName: string
}

export function InfluencerClaimsGrid({ claims, influencerName }: InfluencerClaimsGridProps) {
    const searchParams = useSearchParams()
    const [filteredClaims, setFilteredClaims] = useState<HealthClaim[]>(claims)
    const [isLoading, setIsLoading] = useState(true)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentClaims = filteredClaims.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredClaims.length / itemsPerPage)

    useEffect(() => {
        const status = searchParams.get('status')?.toLowerCase()
        
        let filtered = [...claims]
        
        if (status) {
            filtered = filtered.filter(claim => 
                claim.verificationStatus.toLowerCase() === status
            )
        }

        setFilteredClaims(filtered)
        setIsLoading(false)
    }, [searchParams, claims])

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6 h-[calc(100vh-2rem)] flex flex-col">
            <Card className="relative flex flex-col flex-1 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-card z-10">
                    <div>
                        <CardTitle className="text-2xl font-bold">{influencerName}&apos;s Claims</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {filteredClaims.length} total claims analyzed
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton 
                            data={filteredClaims} 
                            filename={`${influencerName.replace(/\s+/g, '_')}_claims`}
                        />
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Cards per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="6">6 per page</SelectItem>
                                <SelectItem value="12">12 per page</SelectItem>
                                <SelectItem value="18">18 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentClaims.map((claim) => (
                            <ClaimsCard 
                                key={claim.id} 
                                claim={claim} 
                            />
                        ))}
                    </div>
    
                    {filteredClaims.length === 0 && (
                        <div className="text-center py-12 space-y-4">
                            <div className="text-muted-foreground">
                                No claims found for this influencer
                            </div>
                        </div>
                    )}
                </CardContent>
    
                {filteredClaims.length > 0 && (
                    <div className="sticky bottom-0 bg-card border-t flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages} •{' '}
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClaims.length)} of{' '}
                            {filteredClaims.length} claims
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className={currentPage === page ? 'shadow-inner' : ''}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
    
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
            </Card>
        </div>
    )
}
