import { HealthClaimCategory, VerificationStatus } from '@/types';
import { Client, Databases, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);

export async function fetchClaimsByInfluencerId(influencerId: string) {
    try {
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_CLAIMS_COLLECTION_ID!, // Replace with your claims collection ID
            [Query.equal("influencerId", influencerId)]
        );

        const claims = response.documents.map(doc => ({
            id: doc.$id,
            influencerId: doc.influencerId,
            content: doc.content,
            category: doc.category as HealthClaimCategory,
            verificationStatus: doc.verificationStatus as VerificationStatus,
            trustScore: parseFloat(doc.trustScore),
            createdAt: new Date(doc.createdAt),
            analysis: doc.analysis || "",
            sources: {
                contentSources: JSON.parse(doc.contentSources || "[]"),
                scientificSources: JSON.parse(doc.scientificSources || "[]")
            }
        }));

        return claims;
    } catch (error) {
        console.error("Error fetching claims:", error);
        throw error;
    }
}

// interface ResearchConfig {
//     dateRange: {
//         start: string;
//         end: string;
//     };
//     minClaimsCount: number;
//     journals: string[];
//     categories: HealthClaimCategory[];
// }

// export async function saveResearchConfig(config: ResearchConfig, settingsId: string) {
//     try {
//         // You might want to store this per user or as a global config
//         const response = await databases.createDocument(
//             process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
//             COLLECTIONS.RESEARCH_CONFIG,
//             settingsId,
//             config
//         );
        
//         return response;
//     } catch (error) {
//         console.error('Error saving research config:', error);
//         throw error;
//     }
// }

// export async function getResearchConfig(settingsId: string) {
//     try {
//         const response = await databases.getDocument(
//             process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
//             COLLECTIONS.RESEARCH_CONFIG,
//             settingsId
//         );
        
//         return response;
//     } catch (error) {
//         console.error('Error fetching research config:', error);
//         throw error;
//     }
// }
