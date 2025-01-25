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
import { useRouter, useSearchParams } from "next/navigation"
import { mockClaims } from "@/types/mock-data"
import { HealthClaim } from "@/types"

export function ClaimsList() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [filteredClaims, setFilteredClaims] = useState<HealthClaim[]>(mockClaims)

    useEffect(() => {
        const search = searchParams.get('search')?.toLowerCase()
        const category = searchParams.get('category')?.toLowerCase()
        const status = searchParams.get('status')?.toLowerCase()

        let filtered = [...mockClaims]

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
    }, [searchParams])

    const handleRowClick = (claimId: string) => {
        router.push(`/dashboard/claims/${claimId}`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
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
                        {filteredClaims.map((claim) => (
                            <TableRow 
                                key={claim.id}
                                onClick={() => handleRowClick(claim.id)}
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
    )
}
