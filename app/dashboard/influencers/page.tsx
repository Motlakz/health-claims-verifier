import { InfluencerLeaderboard } from "@/components/dashboard/influencer/Leaderboard"
import { mockInfluencers } from "@/types/mock-data"

export default function InfluencersPage() {
    const influencersArray = Object.values(mockInfluencers)

    return (
        <div className="space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold">Influencer Leaderboard</h2>
            <InfluencerLeaderboard influencers={influencersArray} />
        </div>
    )
}
