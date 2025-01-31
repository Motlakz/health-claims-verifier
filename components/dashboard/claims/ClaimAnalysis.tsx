"use client"

import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowUpRight, 
  BookOpen, 
  CheckCircle, 
  Globe, 
  Info, 
  Loader2, 
  PodcastIcon, 
  Twitter, 
  Youtube 
} from "lucide-react"
import Link from "next/link"
import { 
  HealthClaim, 
  CATEGORY_COLORS, 
  HealthClaimCategory, 
  VerificationStatus 
} from "@/types"
import { processClaims } from "@/lib/integrations/claims"
import { TRUSTED_JOURNAL_DOMAINS } from "@/lib/integrations/sources"
import { saveClaimsAnalysis } from "@/lib/claims/savingClaimsAnalysis"
import { updateInfluencerStats } from "@/lib/influencers/updateInfluencerStats"

interface ClaimAnalysisProps {
  className?: string
  onNewAnalysis?: (results: HealthClaim[]) => void
}

export function ClaimAnalysis({ className, onNewAnalysis }: ClaimAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [influencerUrl, setInfluencerUrl] = useState("")
  const [results, setResults] = useState<HealthClaim[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const extractInfluencerIdentifier = (input: string): string => {
    try {
      const url = new URL(input)
      const pathParts = url.pathname.split('/').filter(Boolean)
      
      if (url.hostname.includes('youtube')) return `youtube:${pathParts[0] || input}`
      if (url.hostname.includes('instagram')) return `instagram:${pathParts[0] || input}`
      if (url.hostname.includes('twitter')) return `twitter:${pathParts[0] || input}`
      if (url.hostname.includes('medium')) return `medium:${pathParts[0] || input}`
      
      return input
    } catch {
      return input.replace(/^@/, '')
    }
  }

  const handleAnalysis = async () => {
    if (!influencerUrl) return;
  
    try {
      setIsAnalyzing(true);
      setError(null);
      setResults(null);
      setSavedSuccess(false);
  
      const influencerIdentifier = extractInfluencerIdentifier(influencerUrl);
      const response = await processClaims(influencerIdentifier);
  
      if (!response.success) {
        throw new Error(response.error || "Failed to analyze influencer");
      }
  
      const verifiedClaims: HealthClaim[] = (response.claims ?? []).map((claim, index) => ({
        id: `claim_${Date.now()}_${index}`,
        influencerId: influencerIdentifier,
        content: claim.content,
        category: claim.category as HealthClaimCategory,
        verificationStatus: claim.verificationStatus as VerificationStatus,
        trustScore: claim.trustScore,
        sources: {
          contentSources: claim.sources?.contentSources || [],
          scientificSources: claim.sources?.scientificSources || [],
        },
        createdAt: new Date(claim.createdAt),
        analysis: claim.analysis,
      }));
  
      setResults(verifiedClaims);
      onNewAnalysis?.(verifiedClaims);
  
      // Save the results to the database
      setIsSaving(true);
      const saveResponse = await saveClaimsAnalysis(verifiedClaims, influencerIdentifier);
  
      if (!saveResponse.success) {
        throw new Error(saveResponse.error || "Failed to save analysis");
      }
  
      // Calculate stats for the influencer
      const verifiedClaimsCount = verifiedClaims.filter((c) => c.verificationStatus === "Verified").length;
      const questionableClaimsCount = verifiedClaims.filter((c) => c.verificationStatus === "Questionable").length;
      const debunkedClaimsCount = verifiedClaims.filter((c) => c.verificationStatus === "Debunked").length;
      const totalClaims = verifiedClaims.length;
      const averageTrustScore = verifiedClaims.reduce((sum, claim) => sum + claim.trustScore, 0) / totalClaims;

      // Update influencer stats in the database
      await updateInfluencerStats(influencerIdentifier, {
        verifiedClaims: verifiedClaimsCount,
        questionableClaims: questionableClaimsCount,
        debunkedClaims: debunkedClaimsCount,
        totalClaims,
        averageTrustScore,
      });
      
      setSavedSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Analysis failed. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn("bg-gradient-to-b from-background to-muted/5 rounded-t-xl", className)}>
      <CardHeader className="sticky top-0 bg-background z-10 border-b rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Influencer Claim Analysis</CardTitle>
            <Badge variant="outline" className="gap-1">
              <Info className="h-3.5 w-3.5" /> Beta
            </Badge>
          </div>
          <Button 
            className="w-[200px]" 
            disabled={isAnalyzing || isSaving || !influencerUrl}
            onClick={handleAnalysis}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing content...
              </span>
            ) : isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving analysis...
              </span>
            ) : (
              "Analyze Influencer"
            )}
          </Button>
        </div>
        <CardDescription>
          Verify influencer health claims against verified medical sources
        </CardDescription>
      </CardHeader>
  
      <CardContent className="overflow-y-auto max-h-[600px] space-y-4 pt-4">
        <div className="space-y-4">
          <Input 
            placeholder="Influencer URL, Name or @handle"
            value={influencerUrl}
            onChange={(e) => setInfluencerUrl(e.target.value)}
            disabled={isAnalyzing || isSaving}
          />
        </div>
  
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}
  
        {savedSuccess && (
          <div className="p-3 bg-green-500/10 text-green-500 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Analysis Complete
          </div>
        )}
  
        {(isAnalyzing || isSaving) && !results && (
          <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>{isAnalyzing ? "Analyzing content sources..." : "Saving analysis..."}</p>
            <p className="text-xs mt-2">{isAnalyzing ? "This may take 1-2 minutes" : "Almost done..."}</p>
          </div>
        )}
  
        {results && (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Total Claims:</span>
                  <Badge variant="outline">{results.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Verified:</span>
                  <Badge className="bg-green-500/10 text-green-500">
                    {results.filter(c => c.verificationStatus === 'Verified').length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Questionable:</span>
                  <Badge className="bg-yellow-500/10 text-yellow-500">
                    {results.filter(c => c.verificationStatus === 'Questionable').length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Debunked:</span>
                  <Badge className="bg-red-500/10 text-red-500">
                    {results.filter(c => c.verificationStatus === 'Debunked').length}
                  </Badge>
                </div>
              </div>
            </div>
  
            {results.map((claim) => (
              <div key={claim.id} className="space-y-4 animate-in fade-in rounded-md shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={CATEGORY_COLORS[claim.category]}>
                      {claim.category}
                    </Badge>
                    <Badge variant={
                      claim.verificationStatus === "Verified" ? "default" :
                      claim.verificationStatus === "Questionable" ? "secondary" :
                      "destructive"
                    }>
                      {claim.verificationStatus}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(claim.createdAt).toLocaleTimeString()}
                  </span>
                </div>
  
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column - Influencer Content */}
                  <div className="flex-1 space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-gray-200">
                      <ReactMarkdown>
                        {claim.content}
                      </ReactMarkdown>
                    </div>
  
                    {claim.analysis && (
                      <div className="p-4 bg-blue-50/20 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-medium mb-2">AI Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          {claim.analysis}
                        </p>
                      </div>
                    )}
  
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Content Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {claim.sources.contentSources.length > 0 ? (
                          claim.sources.contentSources.map((source, index) => {
                            try {
                              const url = new URL(source);
                              const hostname = url.hostname.replace(/^www\./, '');
                              const platform = hostname.split('.')[0];
                              
                              const platformData = {
                                icon: Globe,
                                name: platform,
                                class: 'bg-muted',
                              };

                              if (hostname.includes('youtube')) {
                                platformData.icon = Youtube;
                                platformData.name = 'YouTube';
                                platformData.class = 'bg-red-500/10 text-red-600';
                              } else if (hostname.includes('twitter')) {
                                platformData.icon = Twitter;
                                platformData.name = 'Twitter';
                                platformData.class = 'bg-blue-500/10 text-blue-600';
                              } else if (hostname.includes('medium') || hostname.includes('hashnode') || hostname.includes('substack')) {
                                platformData.icon = BookOpen;
                                platformData.name = 'Blog';
                                platformData.class = 'bg-purple-500/10 text-purple-600';
                              } else if (hostname.includes('podcast') || hostname.includes('spotify')) {
                                platformData.icon = PodcastIcon;
                                platformData.name = 'Podcast';
                                platformData.class = 'bg-cyan-500/10 text-cyan-600';
                              }

                              return (
                                <Link
                                  key={index}
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition-all hover:opacity-75",
                                    platformData.class
                                  )}
                                >
                                  <platformData.icon className="h-4 w-4" />
                                  <span>{platformData.name}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                              );
                            } catch {
                              return (
                                <div key={index} className="text-sm text-muted-foreground">
                                  Invalid URL: {source}
                                </div>
                              );
                            }
                          })
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No sources at the moment
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
  
                  {/* Right Column - Scientific Verification */}
                  <div className="flex-1 space-y-4">
                    <div className="p-4 h-40 bg-green-50/20 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                      <h4 className="font-medium mb-3">Scientific Verification</h4>
                      {claim.sources.scientificSources.length > 0 ? (
                        <div className="space-y-2">
                          {claim.sources.scientificSources.map((source, index) => {
                            const displayUrl = source.startsWith('http') ? source : `https://${source}`;
                            try {
                              const url = new URL(displayUrl);
                              const hostname = url.hostname.replace(/^www\./, '');
                              const isTrusted = TRUSTED_JOURNAL_DOMAINS.has(hostname);
  
                              return (
                                <div key={index} className="flex items-center gap-2 group">
                                  <Link
                                    href={displayUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm hover:underline flex-1"
                                  >
                                    <span className="text-primary">{hostname}</span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </Link>
                                  {isTrusted && (
                                    <Badge variant="outline" className="text-xs py-1">
                                      <CheckCircle className="h-5 w-5 mr-1 text-green-500" />
                                      Trusted Journal
                                    </Badge>
                                  )}
                                </div>
                              )
                            } catch {
                              return (
                                <div key={index} className="text-sm text-muted-foreground">
                                  Invalid URL: {source}
                                </div>
                              );
                            }
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No verified scientific sources found for this claim
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
