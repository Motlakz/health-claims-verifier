import { fetchInfluencers } from "./getInfluencers";

export async function fetchOverviewStats() {
    try {
        const influencers = await fetchInfluencers();
        
        // Calculate overview statistics
        const totalInfluencers = influencers.length;
        const totalClaims = influencers.reduce((sum, influencer) => sum + influencer.totalClaims, 0);
        const verifiedClaims = influencers.reduce((sum, influencer) => sum + influencer.verifiedClaims, 0);
        const disputedClaims = influencers.reduce((sum, influencer) => sum + influencer.questionableClaims + influencer.debunkedClaims, 0);
        
        return {
            totalInfluencers,
            totalClaims,
            verifiedClaims,
            disputedClaims,
            verificationRate: totalClaims > 0 ? ((verifiedClaims / totalClaims) * 100).toFixed(0) : '0',
            disputeRate: totalClaims > 0 ? ((disputedClaims / totalClaims) * 100).toFixed(0) : '0'
        };
    } catch (error) {
        console.error("Error fetching overview stats:", error);
        throw error;
    }
}
