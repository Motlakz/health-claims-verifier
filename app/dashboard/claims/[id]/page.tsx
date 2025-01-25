import { ClaimDetail } from "@/components/dashboard/claims/ClaimDetail";

export default function ClaimPage({ params }: { params: { id: string } }) {
    return <ClaimDetail claimId={params.id} />
}
