"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { HealthClaim } from "@/types"

interface RecentClaimsProps {
    claims: HealthClaim[]
}

export function RecentClaims({ claims }: RecentClaimsProps) {
    const router = useRouter()

    const handleRowClick = (claim: HealthClaim) => {
        const encodedClaimData = encodeURIComponent(JSON.stringify(claim))
        router.push(`/dashboard/claims/${claim.id}?claimData=${encodedClaimData}`)
    }

    return (
        <Card className="col-span-4">
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
                        {claims.map((claim) => (
                            <TableRow 
                                key={claim.id}
                                onClick={() => handleRowClick(claim)}
                                className="cursor-pointer hover:bg-muted/50"
                            >
                                <TableCell className="font-medium">{claim.content}</TableCell>
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
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
