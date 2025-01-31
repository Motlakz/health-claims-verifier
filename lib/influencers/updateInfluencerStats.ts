import { ID, Query } from "appwrite";
import { databases } from "../appwrite/appwriteConfig";

interface InfluencerStats {
  verifiedClaims: number;
  questionableClaims: number;
  debunkedClaims: number;
  totalClaims: number;
  averageTrustScore: number;
}

interface InfluencerDetails {
  name: string;
  handle: string;
  platform: string;
  followerCount: number;
}

interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  avgViews: number;
  lastUploadDate?: string;
  engagementRate: number;
}

export async function updateInfluencerStats(
  influencerId: string,
  stats: InfluencerStats,
  influencerDetails?: InfluencerDetails,
  engagementMetrics?: EngagementMetrics
): Promise<void> {
  try {
    // Fetch existing influencer data
    const existingInfluencer = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_INFLUENCERS_COLLECTION_ID!,
      [Query.equal("id", influencerId)]
    );

    // Use extracted details if provided, otherwise fall back to existing data
    const influencerData = {
      id: influencerId,
      name: influencerDetails?.name || existingInfluencer.documents[0]?.name || "New Influencer",
      handle: influencerDetails?.handle || existingInfluencer.documents[0]?.handle || "new_influencer",
      avatarUrl: existingInfluencer.documents[0]?.avatarUrl || "https://example.com/avatar.jpg",
      category: existingInfluencer.documents[0]?.category || "Uncategorized",
      averageTrustScore: stats.averageTrustScore,
      trend: stats.averageTrustScore > 75 ? "up" : "down",
      followerCount: influencerDetails?.followerCount || existingInfluencer.documents[0]?.followerCount || 0,
      totalClaims: stats.totalClaims,
      verifiedClaims: stats.verifiedClaims,
      questionableClaims: stats.questionableClaims,
      debunkedClaims: stats.debunkedClaims,
      platform: influencerDetails?.platform || existingInfluencer.documents[0]?.platform || "Unknown",
      likes: engagementMetrics?.likes || existingInfluencer.documents[0]?.likes || 0,
      comments: engagementMetrics?.comments || existingInfluencer.documents[0]?.comments || 0,
      shares: engagementMetrics?.shares || existingInfluencer.documents[0]?.shares || 0,
      avgViews: engagementMetrics?.avgViews || existingInfluencer.documents[0]?.avgViews || 0,
      engagementRate: engagementMetrics?.engagementRate || existingInfluencer.documents[0]?.engagementRate || 0,
      lastUploadDate: engagementMetrics?.lastUploadDate || existingInfluencer.documents[0]?.lastUploadDate || new Date().toISOString(),
      claims: [],
    };

    if (existingInfluencer.documents.length > 0) {
      // Update existing influencer
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INFLUENCERS_COLLECTION_ID!,
        existingInfluencer.documents[0].$id,
        influencerData
      );
    } else {
      // Create new influencer
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INFLUENCERS_COLLECTION_ID!,
        ID.unique(),
        influencerData
      );
    }
  } catch (error) {
    console.error("Error updating influencer stats:", error);
    throw error;
  }
}
