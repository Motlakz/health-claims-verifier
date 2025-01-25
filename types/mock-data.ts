import { HealthClaim, Influencer } from "."

export const mockInfluencers: Record<string, Influencer> = {
    "1": {
        id: "1",
        name: "Dr. Peter Attia",
        handle: "peterattiamd",
        avatarUrl: "/avatars/peter-attia.jpg",
        category: "Medicine",
        averageTrustScore: 94,
        trend: "up",
        followerCount: 1200000,
        totalClaims: 245,
        verifiedClaims: 203,
        questionableClaims: 32,
        debunkedClaims: 10,
        yearlyRevenue: "5.0M",
        platform: "YouTube",
        likes: 50000,
        comments: 2500,
        shares: 1200,
        avgViews: 100000,
        engagementRate: 4.2,
        lastUploadDate: "2024-03-10",
        claims: [
            {
                id: "c1",
                title: "Zone 2 training improves mitochondrial density",
                status: "verified",
                date: "2024-02-15",
                source: "https://example.com/study1",
                analysis: "Randomized controlled trial confirms benefits"
            },
            {
                id: "c2",
                title: "Ketosis prevents cognitive decline",
                status: "questionable",
                date: "2024-01-20",
                source: "https://example.com/study2",
                analysis: "Conflicting results in recent meta-analysis"
            }
        ],
        products: 3,
        demographics: {
            gender: { male: 65, female: 35, other: 0 },
            age: { "25-34": 30, "35-44": 45, "45-54": 25 }
        }
    },
    "4": {
        id: "4",
        name: "Andrew Huberman",
        handle: "hubermanlab",
        avatarUrl: "/avatars/huberman.jpg",
        category: "Neuroscience",
        averageTrustScore: 89,
        trend: "up",
        followerCount: 4200000,
        totalClaims: 127,
        verifiedClaims: 127,
        questionableClaims: 0,
        debunkedClaims: 0,
        yearlyRevenue: "5.0M",
        platform: "Podcast",
        likes: 250000,
        comments: 15000,
        shares: 8000,
        avgViews: 200000,
        engagementRate: 4.5,
        lastUploadDate: "2024-03-12",
        claims: [
            {
                id: "h1",
                title: "Morning sunlight exposure regulates cortisol",
                status: "verified",
                date: "2024-03-01",
                source: "https://example.com/study3",
                analysis: "Multiple studies confirm circadian rhythm benefits"
            },
            {
                id: "h2",
                title: "NSDR enhances neuroplasticity",
                status: "verified",
                date: "2024-02-28",
                source: "https://example.com/study4",
                analysis: "fMRI studies show increased brain connectivity"
            }
        ],
        products: 1,
        demographics: {
            gender: { male: 52, female: 45, other: 3 },
            age: { "18-24": 20, "25-34": 50, "35-44": 30 }
        }
    }
}

export const mockClaims: HealthClaim[] = [
    {
        id: "1",
        influencerId: "4",
        content: "Viewing sunlight within 30-60 minutes of waking enhances cortisol release",
        category: "Sleep",
        verificationStatus: "Verified",
        trustScore: 92,
        sourceUrl: "https://example.com/sunlight-study",
        verificationSources: [
            "Multiple studies confirm morning light exposure affects cortisol rhythms",
            "Timing window supported by research"
        ],
        createdAt: new Date("2024-01-14")
    },
    {
        id: "2",
        influencerId: "4",
        content: "Non-sleep deep rest (NSDR) protocols can accelerate learning and recovery",
        category: "Performance",
        verificationStatus: "Verified",
        trustScore: 88,
        sourceUrl: "https://example.com/nsdr-study",
        verificationSources: [
            "Research paper on NSDR protocols",
            "Clinical studies on recovery mechanisms"
        ],
        createdAt: new Date("2023-12-28")
    }
]
