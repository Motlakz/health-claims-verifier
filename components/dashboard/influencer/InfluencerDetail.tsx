"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    TrendingUp, 
    Users,
    FileCheck,
    Heart,
} from "lucide-react"
import { HealthClaim, Influencer } from "@/types"
import InfluencerStatCard from "./InfluencerStatCard"
import { HealthClaimCategory, CATEGORY_COLORS } from "@/types"
import InfluencerAnalytics from "./InfluencerAnalytics"

interface InfluencerDetailProps {
    influencer: Influencer | null
    claims: HealthClaim[]
    onClose: () => void
}

export function InfluencerDetail({ influencer, onClose, claims }: InfluencerDetailProps) {
    if (!influencer) return null
    const categories = Object.keys(CATEGORY_COLORS) as HealthClaimCategory[];

    return (
        <Dialog open={!!influencer} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[600px] overflow-y-auto">
                <DialogHeader>
                    {/* Profile Header */}
                    <DialogTitle className="text-2xl font-bold">{influencer.name}</DialogTitle>
                    <div className="flex items-start space-x-4 mb-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={influencer.avatarUrl} />
                            <AvatarFallback>{influencer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <span className="text-muted-foreground">@{influencer.handle}</span>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{influencer.platform}</Badge>
                                <Badge variant="outline">{influencer.category}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfluencerStatCard 
                            title="Trust Score" 
                            value={`${influencer.averageTrustScore.toFixed(1)}%`}
                            trend={influencer.trend}
                            subtitle={`Based on ${influencer.totalClaims} claims`}
                            icon={<TrendingUp className="h-4 w-4 fill-cyan-400" />}
                            colorClass={
                                influencer.averageTrustScore > 75 ? "text-green-600" :
                                influencer.averageTrustScore > 50 ? "text-yellow-500" : "text-red-500"
                            }
                        />

                        <InfluencerStatCard 
                            title="Followers" 
                            value={new Intl.NumberFormat().format(influencer.followerCount)}
                            subtitle="Total following"
                            icon={<Users className="h-4 w-4 text-purple-400" />}
                        />

                        <InfluencerStatCard 
                            title="Verified Claims"
                            value={influencer.verifiedClaims}
                            subtitle="Total verified claims"
                            icon={<FileCheck className="h-4 w-4 text-cyan-400" />}
                        />

                        <InfluencerStatCard 
                            title="Engagement Rate" 
                            value={`${influencer.engagementRate}%`}
                            subtitle="Avg. engagement"
                            icon={<Heart className="h-4 w-4 text-red-400" />}
                        />
                    </div>

                    {/* Tabs Section */}
                    <Tabs defaultValue="claims" className="py-6">
                        <TabsList className="mb-6">
                            <TabsTrigger value="claims">Claims Overview</TabsTrigger>
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                        </TabsList>

                        {/* Claims Analysis Tab */}
                        <TabsContent value="claims" className="space-y-4">
                            <InfluencerAnalytics
                                verifiedClaims={influencer.verifiedClaims}
                                questionableClaims={influencer.questionableClaims}
                                debunkedClaims={influencer.debunkedClaims}
                                totalClaims={influencer.totalClaims}
                                averageTrustScore={influencer.averageTrustScore}
                            />
                        </TabsContent>

                        {/* Categories Tab */}
                        <TabsContent value="categories">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {categories.map((cat) => {
                                    const claimCount = claims.filter((claim) => {
                                        // Match by influencer name (case-insensitive)
                                        const isInfluencerClaim = 
                                            claim.influencerId.toLowerCase() === influencer.name.toLowerCase();
                                        
                                            return isInfluencerClaim && claim.category === cat;
                                        }).length;

                                    return (
                                        <Badge
                                            key={cat}
                                            variant="outline"
                                            className={`justify-center py-2 hover:bg-accent cursor-pointer ${CATEGORY_COLORS[cat]}`}
                                        >
                                            <span>{cat}</span>
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                ({claimCount})
                                            </span>
                                        </Badge>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
