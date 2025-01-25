export type HealthClaim = {
    id: string;
    influencerId: string;
    content: string;
    category: 'Nutrition' | 'Medicine' | 'Mental Health' | 'Fitness' | 'Sleep' | 'Performance';
    verificationStatus: 'Verified' | 'Questionable' | 'Debunked';
    trustScore: number;
    sourceUrl: string;
    verificationSources: string[];
    createdAt: Date;
};

export interface Demographics {
    gender: Record<string, number>;
    age: Record<string, number>;
}

export interface Influencer {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string;
    category: string;
    averageTrustScore: number;
    trend: "up" | "down";
    followerCount: number;
    totalClaims: number;
    verifiedClaims: number;
    questionableClaims: number;
    debunkedClaims: number;
    yearlyRevenue: string;
    platform: string;
    likes: number;
    comments: number;
    shares: number;
    avgViews: number;
    engagementRate: number;
    lastUploadDate: string;
    claims: Array<{
        id: string;
        title: string;
        status: "verified" | "questionable" | "debunked";
        date: string;
        source?: string;
        analysis?: string;
    }>;
    products?: number;
    demographics?: Demographics
}
  
export type AnalysisConfig = {
    dateRange: {
        start: Date;
        end: Date;
    };
    claimsLimit: number;
    journals: string[];
    platforms: string[];
};
