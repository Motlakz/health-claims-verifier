"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
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
import {
    Dialog,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { type Influencer } from "@/types"
import { cn } from "@/lib/utils"
import {
    TrendingUp,
    TrendingDown,
    Search,
} from "lucide-react"
import { InfluencerDetail } from "./InfluencerDetail"

interface InfluencerLeaderboardProps {
    influencers: Influencer[]
    className?: string
}

export function InfluencerLeaderboard({
    influencers,
    className,
}: InfluencerLeaderboardProps) {
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredInfluencers = influencers.filter(inf => 
        inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inf.handle.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <Card className={cn(className)}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Influencer Leaderboard</CardTitle>
                            <CardDescription>
                                Track and analyze health claims from top influencers
                            </CardDescription>
                        </div>
                        <div className="relative w-[200px]">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search influencers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Influencer</TableHead>
                                <TableHead>Trust Score</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Followers</TableHead>
                                <TableHead>Claims</TableHead>
                                <TableHead>Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInfluencers.map((influencer) => (
                                <TableRow 
                                    key={influencer.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => setSelectedInfluencer(influencer)}
                                >
                                    <TableCell className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarImage src={influencer.avatarUrl} />
                                            <AvatarFallback>
                                                {influencer.name.substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{influencer.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                @{influencer.handle}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 h-2 rounded-full bg-slate-200">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        influencer.averageTrustScore > 75
                                                            ? "bg-green-500"
                                                            : influencer.averageTrustScore > 50
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    )}
                                                    style={{
                                                        width: `${influencer.averageTrustScore}%`,
                                                    }}
                                                />
                                            </div>
                                            <span>{influencer.averageTrustScore.toFixed(1)}%</span>
                                            {influencer.trend === "up" ? (
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{influencer.platform}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat().format(influencer.followerCount)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>{influencer.totalClaims} Total</div>
                                            <div className="text-muted-foreground">
                                                {influencer.verifiedClaims} Verified
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{influencer.yearlyRevenue}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)}>
                <InfluencerDetail 
                    influencer={selectedInfluencer} 
                    onClose={() => setSelectedInfluencer(null)}
                />
            </Dialog>
        </>
    )
}
