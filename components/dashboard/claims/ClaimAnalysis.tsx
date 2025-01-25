/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/claims/ClaimAnalysis.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

interface ClaimAnalysisProps {
    className?: string
    onNewAnalysis?: (result: any) => void
}

export function ClaimAnalysis({ className, onNewAnalysis }: ClaimAnalysisProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [influencerUrl, setInfluencerUrl] = useState("")
    const [claim, setClaim] = useState("")

    const handleAnalysis = async () => {
        if (!influencerUrl || !claim) return

        try {
            setIsAnalyzing(true)
            
            // Simulated API response
            const mockResponse = {
                id: Math.random().toString(36).substr(2, 9),
                claim: claim,
                status: "pending",
                influencer: influencerUrl,
                analysis: "",
                confidence: 0,
                timestamp: new Date().toISOString()
            }

            // Simulate API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 2000))
            
            // Simulated analysis result
            const result = {
                ...mockResponse,
                status: "completed",
                analysis: "This claim appears to be supported by multiple peer-reviewed studies. However, consult a healthcare professional for personal medical advice.",
                confidence: 84,
                relatedClaims: 3,
                sources: [
                    "https://pubmed.ncbi.nlm.nih.gov/example1",
                    "https://pubmed.ncbi.nlm.nih.gov/example2"
                ]
            }

            if (onNewAnalysis) {
                onNewAnalysis(result)
            }
            
        } catch (error) {
            console.error('Analysis failed:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Card className={cn("bg-gradient-to-b from-background to-muted/5", className)}>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>New Claim Analysis</CardTitle>
                    <Badge variant="outline" className="gap-1">
                        <Info className="h-3.5 w-3.5" /> Beta
                    </Badge>
                </div>
                <CardDescription>
                    Verify health claims using evidence-based analysis
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Input 
                        placeholder="Influencer URL or @handle"
                        value={influencerUrl}
                        onChange={(e) => setInfluencerUrl(e.target.value)}
                        disabled={isAnalyzing}
                    />
                </div>
                <div className="space-y-2">
                    <Textarea
                        placeholder="Paste the health claim here..."
                        className="min-h-[120px]"
                        value={claim}
                        onChange={(e) => setClaim(e.target.value)}
                        disabled={isAnalyzing}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    disabled={isAnalyzing || !influencerUrl || !claim}
                    onClick={handleAnalysis}
                >
                    {isAnalyzing ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-pulse">🔍 Analyzing...</span>
                        </span>
                    ) : (
                        "Validate Claim"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
