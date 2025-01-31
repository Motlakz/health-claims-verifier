"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HealthClaim } from "@/types"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface ClaimsCardProps {
  claim: HealthClaim
}

export default function ClaimsCard({ claim }: ClaimsCardProps) {
  const router = useRouter()

  const handleClick = () => {
    const encodedClaimData = encodeURIComponent(JSON.stringify(claim))
    router.push(`/dashboard/claims/${claim.id}?claimData=${encodedClaimData}`)
  }

  return (
    <Card 
      className="hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="font-medium">{claim.content}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{claim.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(claim.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Badge
            variant={
              claim.verificationStatus === "Verified"
                ? "default"
                : claim.verificationStatus === "Questionable"
                ? "secondary"
                : "destructive"
            }
            className="ml-2"
          >
            {claim.verificationStatus}
          </Badge>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${
              claim.trustScore >= 80 ? 'text-green-500' : 
              claim.trustScore >= 60 ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {claim.trustScore}% Trust Score
            </span>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
