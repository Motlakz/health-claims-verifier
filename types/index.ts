export interface HealthClaim {
    id: string
    influencerId: string
    content: string
    category: HealthClaimCategory
    verificationStatus: VerificationStatus
    trustScore: number
    createdAt: Date
    analysis?: string
    sources: {
        contentSources: string[]
        scientificSources: string[]
    }
}

export const AppwriteCategoryMap: Record<HealthClaimCategory, string> = {
    'Nutrition': 'Nutrition',
    'Medicine': 'Medicine',
    'Mental Health': 'MentalHealth', // Map "Mental Health" to "MentalHealth"
    'Fitness': 'Fitness',
    'Sleep': 'Sleep',
    'Performance': 'Performance',
    'Neuroscience': 'Neuroscience',
    'Uncategorized': 'Uncategorized'
};

export type HealthClaimCategory = 
    | 'Nutrition' 
    | 'Medicine' 
    | 'Mental Health' 
    | 'Fitness' 
    | 'Sleep' 
    | 'Performance' 
    | 'Neuroscience'
    | 'Uncategorized'

export const CATEGORY_COLORS: Record<HealthClaimCategory, string> = {
    'Nutrition': 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    'Medicine': 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    'Mental Health': 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
    'Fitness': 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
    'Sleep': 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
    'Performance': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    'Neuroscience': 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
    'Uncategorized': 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
};

export type VerificationStatus = 
    | "Verified"
    | "Questionable"
    | "Debunked";

export interface Influencer {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string;
    category: HealthClaimCategory;
    averageTrustScore: number;
    trend: "up" | "down";
    followerCount: number;
    totalClaims: number;
    verifiedClaims: number;
    questionableClaims: number;
    debunkedClaims: number;
    platform: string;
    likes: number;
    comments: number;
    shares: number;
    avgViews: number;
    engagementRate: number;
    lastUploadDate: string;
    claims: HealthClaim[];
}
