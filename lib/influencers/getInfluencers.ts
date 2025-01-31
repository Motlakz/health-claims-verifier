import { databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";

export async function fetchInfluencers() {
    try {
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_INFLUENCERS_COLLECTION_ID!,
            [Query.orderDesc("averageTrustScore")]
        );

        const influencers = response.documents.map(doc => ({
            id: doc.$id,
            name: doc.name,
            handle: doc.handle,
            avatarUrl: doc.avatarUrl,
            category: doc.category,
            averageTrustScore: parseFloat(doc.averageTrustScore),
            trend: doc.trend as "up" | "down",
            followerCount: parseInt(doc.followerCount),
            claims: doc.claims || [],
            totalClaims: parseInt(doc.totalClaims),
            verifiedClaims: parseInt(doc.verifiedClaims),
            questionableClaims: parseInt(doc.questionableClaims),
            debunkedClaims: parseInt(doc.debunkedClaims),
            platform: doc.platform,
            likes: parseInt(doc.likes),
            comments: parseInt(doc.comments),
            shares: parseInt(doc.shares),
            avgViews: parseInt(doc.avgViews),
            engagementRate: parseFloat(doc.engagementRate),
            lastUploadDate: doc.lastUploadDate,
        }));

        return influencers;
    } catch (error) {
        console.error("Error fetching influencers:", error);
        throw error;
    }
}
