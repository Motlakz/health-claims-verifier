import { HealthClaim } from "@/types";
import { saveClaimsToAppwrite } from "./savingClaims";
import { updateInfluencerStats } from "../influencers/updateInfluencerStats";

export async function saveClaimsAnalysis(
  claims: Omit<HealthClaim, 'id'>[],
  influencerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Calculate influencer stats
    const influencerStats = claims.reduce(
      (acc, claim) => {
        switch (claim.verificationStatus) {
          case 'Verified':
            acc.verifiedClaims++;
            break;
          case 'Questionable':
            acc.questionableClaims++;
            break;
          case 'Debunked':
            acc.debunkedClaims++;
            break;
        }
        acc.totalClaims++;
        acc.averageTrustScore =
          (acc.averageTrustScore * (acc.totalClaims - 1) + claim.trustScore) / acc.totalClaims;
        return acc;
      },
      {
        verifiedClaims: 0,
        questionableClaims: 0,
        debunkedClaims: 0,
        totalClaims: 0,
        averageTrustScore: 0
      }
    );

    // Save claims using the unified function
    const saveResult = await saveClaimsToAppwrite(claims, influencerId);
    if (!saveResult.success) {
      throw new Error(saveResult.error);
    }

    // Update influencer stats and save influencer data
    await updateInfluencerStats(influencerId, influencerStats);

    return { success: true };
  } catch (error) {
    console.error("Error saving claims analysis:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save claims analysis"
    };
  }
}
