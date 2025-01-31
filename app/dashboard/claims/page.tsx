"use client";

import { useEffect, useState } from "react";
import { ClaimAnalysis } from "@/components/dashboard/claims/ClaimAnalysis";
import { ClaimsList } from "@/components/dashboard/claims/ClaimsList";
import { ClaimsFilter } from "@/components/shared/ClaimsFilter";
import { SearchBar } from "@/components/shared/SearchBar";
import { HealthClaim } from "@/types";
import { fetchClaims } from "@/lib/claims/getClaims";
import { DataLoader } from "@/components/dashboard/Loader";

export default function ClaimsPage() {
    const [claims, setClaims] = useState<HealthClaim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch claims from Appwrite when the component mounts
    useEffect(() => {
        async function loadClaims() {
            try {
                const fetchedClaims = await fetchClaims();
                setClaims(fetchedClaims);
            } catch (err) {
                setError("Failed to load claims. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadClaims();
    }, []);

    const handleNewAnalysis = (results: HealthClaim[]) => {
        setClaims((prevClaims) => [...results, ...prevClaims]);
    };

    if (loading) {
        return <div><DataLoader /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Claims Analysis</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <SearchBar />
                <ClaimsFilter />
            </div>
            <ClaimAnalysis onNewAnalysis={handleNewAnalysis} />
            <ClaimsList claims={claims} />
        </div>
    );
}
