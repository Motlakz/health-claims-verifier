import { databases } from "../appwrite/appwriteConfig";
import { ID } from "appwrite";
import { AppwriteCategoryMap, HealthClaim, HealthClaimCategory, VerificationStatus } from "@/types";

export async function saveClaimsToAppwrite(
  claims: Omit<HealthClaim, 'id'>[],
  influencerId: string,
  batchSize: number = 10
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate claims before processing
    const validCategories: HealthClaimCategory[] = [
      'Nutrition', 'Medicine', 'Mental Health', 'Fitness',
      'Sleep', 'Performance', 'Neuroscience', 'Uncategorized'
    ];
    const validVerificationStatuses: VerificationStatus[] = [
      'Verified', 'Questionable', 'Debunked'
    ];

    // Save claims in batches to avoid overwhelming the database
    for (let i = 0; i < claims.length; i += batchSize) {
      const batch = claims.slice(i, i + batchSize);
      await Promise.all(
        batch.map(claim => {
          // Validate category
          if (!validCategories.includes(claim.category)) {
            throw new Error(`Invalid category: ${claim.category}`);
          }

          // Validate verificationStatus
          if (!validVerificationStatuses.includes(claim.verificationStatus)) {
            throw new Error(`Invalid verification status: ${claim.verificationStatus}`);
          }

          // Map category to Appwrite enum value
          const appwriteCategory = AppwriteCategoryMap[claim.category];

          // Save claim to Appwrite
          return databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_CLAIMS_COLLECTION_ID!,
            ID.unique(),
            {
              id: ID.unique(), // Use a unique ID for the document
              influencerId,
              content: claim.content,
              category: appwriteCategory, // Use mapped category value
              verificationStatus: claim.verificationStatus,
              trustScore: claim.trustScore,
              analysis: claim.analysis,
              contentSources: claim.sources.contentSources, // Pass array directly
              scientificSources: claim.sources.scientificSources, // Pass array directly
              createdAt: new Date().toISOString()
            }
          );
        })
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Appwrite save error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save claims to Appwrite"
    };
  }
}
