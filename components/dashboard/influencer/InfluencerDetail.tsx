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
    DollarSign, 
    Users,
    Check,
    X,
    AlertTriangle,
    Eye,
    Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Influencer } from "@/types"
import InfluencerStatCard from "./InfluencerStatCard"
import DemographicsSection from "./DemographicsSection"
import EngagementSection from "./EngagementSection"
import ClaimsBreakdown from "./ClaimsBreakdown"

interface InfluencerDetailProps {
    influencer: Influencer | null
    onClose: () => void
}

export function InfluencerDetail({ influencer, onClose }: InfluencerDetailProps) {
    if (!influencer) return null

    const categories = [
        "Sleep", "Performance", "Hormones", "Nutrition",
        "Exercise", "Stress", "Cognition", "Mental Health"
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "verified": return <Check className="h-4 w-4 text-green-500" />
            case "questionable": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case "debunked": return <X className="h-4 w-4 text-red-500" />
            default: return null
        }
    }

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
                            <div className="text-muted-foreground">@{influencer.handle}</div>
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
                            value={`${influencer.averageTrustScore}%`}
                            trend={influencer.trend}
                            subtitle={`Based on ${influencer.totalClaims} claims`}
                            icon={<TrendingUp className="h-4 w-4 fill-cyan-400" />}
                            colorClass={
                                influencer.averageTrustScore > 75 ? "text-green-600" :
                                influencer.averageTrustScore > 50 ? "text-yellow-500" : "text-red-500"
                            }
                        />

                        <InfluencerStatCard 
                            title="Yearly Revenue" 
                            value={`$${influencer.yearlyRevenue}`}
                            subtitle="Estimated earnings"
                            icon={<DollarSign className="h-4 w-4 text-green-500" />}
                        />

                        <InfluencerStatCard 
                            title="Followers" 
                            value={new Intl.NumberFormat().format(influencer.followerCount)}
                            subtitle="Total following"
                            icon={<Users className="h-4 w-4 text-blue-400" />}
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
                            <TabsTrigger value="claims">Claims Analysis</TabsTrigger>
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                            <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
                            <TabsTrigger value="products">Products ({influencer.products || 0})</TabsTrigger>
                        </TabsList>

                        {/* Claims Analysis Tab */}
                        <TabsContent value="claims" className="space-y-4">
                            <div className="space-y-4">
                                {influencer.claims.map((claim) => (
                                    <div key={claim.id} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(claim.status)}
                                                <span className="font-medium">{claim.title}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(claim.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Source
                                            </Button>
                                        </div>
                                        
                                        {claim.analysis && (
                                            <div className="p-3 bg-muted/50 rounded-md mt-2">
                                                <div className="text-sm flex gap-2">
                                                    <span className="font-semibold">Analysis:</span>
                                                    {claim.analysis}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Categories Tab */}
                        <TabsContent value="categories">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {categories.map((cat) => (
                                    <Badge 
                                        key={cat} 
                                        variant="outline" 
                                        className="justify-center py-2 hover:bg-accent cursor-pointer"
                                    >
                                        {cat}
                                    </Badge>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Detailed Stats Tab */}
                        <TabsContent value="stats" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <EngagementSection
                                    likes={influencer.likes}
                                    comments={influencer.comments}
                                    shares={influencer.shares}
                                    avgViews={influencer.avgViews}
                                    lastUpload={influencer.lastUploadDate}
                                />
                                
                                <ClaimsBreakdown 
                                    verified={influencer.verifiedClaims}
                                    questionable={influencer.questionableClaims}
                                    debunked={influencer.debunkedClaims}
                                    total={influencer.totalClaims}
                                />
                            </div>

                            <Separator />

                            {influencer.demographics && (
                                <DemographicsSection demographics={influencer.demographics} />
                            )}
                        </TabsContent>

                        {/* Products Tab */}
                        <TabsContent value="products">
                            <div className="p-4 text-center text-muted-foreground">
                                No recommended products found
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
