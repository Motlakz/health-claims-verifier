"use client"

import { useEffect, useState } from "react";
import { InfluencerLeaderboard } from "@/components/dashboard/influencer/Leaderboard";
import { DataLoader } from "@/components/dashboard/Loader";
import { fetchInfluencers } from "@/lib/influencers/getInfluencers";

export default function InfluencerPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadInfluencers() {
            try {
                await fetchInfluencers();
            } catch (err) {
                setError("Failed to load influencers");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadInfluencers();
    }, []);

    if (loading) {
        return <div><DataLoader /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold">Influencer Leaderboard</h2>
            <InfluencerLeaderboard />
        </div>
    );
}
