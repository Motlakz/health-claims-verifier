import { ClaimAnalysis } from "@/components/dashboard/claims/ClaimAnalysis"
import { InfluencerLeaderboard } from "@/components/dashboard/influencer/Leaderboard"
import { OverviewStats } from "@/components/dashboard/OverviewStats"
import { RecentClaims } from "@/components/dashboard/claims/RecentClaims"
import { mockClaims, mockInfluencers } from "@/types/mock-data"

export default function DashboardPage() {
    // Convert mockInfluencers Record to array for the leaderboard
    const influencersArray = Object.values(mockInfluencers)

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <OverviewStats />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <InfluencerLeaderboard
                    influencers={influencersArray}
                    className="col-span-4"
                />
                <ClaimAnalysis className="col-span-3" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RecentClaims claims={mockClaims} />
            </div>
        </div>
    )
}