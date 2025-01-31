"use client";

import { useEffect, useState } from "react";
import { ClaimAnalysis } from "@/components/dashboard/claims/ClaimAnalysis";
import { InfluencerLeaderboard } from "@/components/dashboard/influencer/Leaderboard";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { RecentClaims } from "@/components/dashboard/claims/RecentClaims";
import { HealthClaim } from "@/types";
import { fetchClaims } from "@/lib/claims/getClaims";
import { fetchOverviewStats } from "@/lib/influencers/getOverviewStats";
import { DataLoader } from "@/components/dashboard/Loader";

export default function DashboardPage() {
  const [claims, setClaims] = useState<HealthClaim[]>([]);
  const [overviewStats, setOverviewStats] = useState({
    totalInfluencers: 0,
    totalClaims: 0,
    verifiedClaims: 0,
    disputedClaims: 0,
    verificationRate: "0",
    disputeRate: "0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    async function loadData() {
      try {
        const [claimsData, statsData] = await Promise.all([
          fetchClaims(),
          fetchOverviewStats(),
        ]);

        setClaims(claimsData);
        setOverviewStats(statsData);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div><DataLoader /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <OverviewStats
        totalInfluencers={overviewStats.totalInfluencers}
        totalClaims={overviewStats.totalClaims}
        verifiedClaims={overviewStats.verifiedClaims}
        disputedClaims={overviewStats.disputedClaims}
        verificationRate={overviewStats.verificationRate}
        disputeRate={overviewStats.disputeRate}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <InfluencerLeaderboard
          className="col-span-4"
        />
        <ClaimAnalysis className="col-span-4" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <RecentClaims claims={claims} />
      </div>
    </div>
  );
}
