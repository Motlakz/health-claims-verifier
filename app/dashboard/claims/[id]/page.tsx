// app/dashboard/claims/[id]/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { ClaimDetail } from "@/components/dashboard/claims/ClaimDetail"
import { notFound } from "next/navigation"
import { HealthClaim } from "@/types"

export default function ClaimPage() {
    const searchParams = useSearchParams()
    const claimData = searchParams.get('claimData')
    
    let claim: HealthClaim | null = null
    
    try {
        if (claimData) {
            claim = JSON.parse(decodeURIComponent(claimData)) as HealthClaim
        }
    } catch (error) {
        console.error('Error parsing claim data:', error)
    }

    if (!claim) {
        return notFound()
    }

    return <ClaimDetail claim={claim} />
}
