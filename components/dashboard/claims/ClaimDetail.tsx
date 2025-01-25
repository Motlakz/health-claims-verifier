"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockClaims, mockInfluencers } from "@/types/mock-data"
import { ExternalLink } from "lucide-react"

interface ClaimDetailProps {
    claimId: string
}

export function ClaimDetail({ claimId }: ClaimDetailProps) {
    const claim = mockClaims.find(c => c.id === claimId) || mockClaims[0]
    const influencer = mockInfluencers[claim.influencerId]

    return (
        <div className="space-y-6 p-6 bg-background">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Claim Details</h2>
                    <p className="text-sm text-muted-foreground">
                        Detailed analysis and verification of health claim
                    </p>
                </div>
                <Badge 
                    variant={
                        claim.verificationStatus === "Verified"
                            ? "default"
                            : claim.verificationStatus === "Questionable"
                            ? "secondary"
                            : "destructive"
                    }
                    className="ml-auto"
                >
                    {claim.verificationStatus}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4 bg-card">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={influencer.avatarUrl} />
                                <AvatarFallback>
                                    {influencer.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium leading-none">
                                    {influencer.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {influencer.handle}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium">{claim.content}</p>
                        <div className="mt-4 flex items-center space-x-4">
                            <Badge variant="outline">{claim.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                                {claim.createdAt.toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-card">
                    <CardHeader>
                        <CardTitle>Trust Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <span className={`text-5xl font-bold ${
                                    claim.trustScore >= 80 ? 'text-green-500' : 
                                    claim.trustScore >= 60 ? 'text-yellow-500' : 
                                    'text-red-500'
                                }`}>
                                    {claim.trustScore}%
                                </span>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Based on scientific evidence
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="analysis" className="space-y-4">
                <TabsList className="bg-muted">
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="sources">Sources</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
                            <p>Analysis of the claim and its scientific basis.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sources" className="space-y-4">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
                            <ul className="space-y-2">
                                {claim.verificationSources.map((source, i) => (
                                    <li key={i} className="flex items-center space-x-2">
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-primary">
                                            {source}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">
                                Verification history and updates will appear here
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
