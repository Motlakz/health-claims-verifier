import { ClaimAnalysis } from "@/components/dashboard/claims/ClaimAnalysis"
import { ClaimsList } from "@/components/dashboard/claims/ClaimsList"
import { ClaimsFilter } from "@/components/shared/ClaimsFilter"
import { SearchBar } from "@/components/shared/SearchBar"

export default function ClaimsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Claims Analysis</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <SearchBar />
                <ClaimsFilter />
            </div>

            <ClaimsList />
            <ClaimAnalysis />
        </div>
    )
}
