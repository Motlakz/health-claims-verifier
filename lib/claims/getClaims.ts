import { databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { HealthClaim } from "@/types";

export async function fetchClaims(): Promise<HealthClaim[]> {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CLAIMS_COLLECTION_ID!,
      [Query.orderDesc("createdAt")] // Sort by createdAt in descending order
    );

    // Map Appwrite documents to HealthClaim objects
    const claims: HealthClaim[] = response.documents.map((doc) => ({
      id: doc.$id,
      influencerId: doc.influencerId,
      content: doc.content,
      category: doc.category,
      verificationStatus: doc.verificationStatus,
      trustScore: doc.trustScore,
      analysis: doc.analysis,
      sources: {
        contentSources: doc.contentSources,
        scientificSources: doc.scientificSources,
      },
      createdAt: new Date(doc.createdAt),
    }));

    return claims;
  } catch (error) {
    console.error("Error fetching claims:", error);
    throw error;
  }
}