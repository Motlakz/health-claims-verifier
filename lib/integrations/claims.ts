/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { OpenAI } from "openai"
import { calculateTrustScore, cosineSimilarity } from "@/lib/utils"
import { HealthClaim, HealthClaimCategory, VerificationStatus } from "@/types"
import { saveClaimsToAppwrite } from "../claims/savingClaims"
import { updateInfluencerStats } from "../influencers/updateInfluencerStats"
import { openaiLimit, perplexityLimit, serperLimit } from "./rateLimiter"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY!,
  baseURL: "https://api.perplexity.ai"
})

// Helper function to fetch Apple Podcast transcripts
async function fetchApplePodcastTranscripts(identifier: string, usedLinks: Set<string>) {
  try {
    const searchResponse = await fetch(
      `https://itunes.apple.com/search?media=podcast&term=${encodeURIComponent(identifier)}&limit=5`
    );
    const searchData = await searchResponse.json();

    const transcriptResults = [];

    for (const podcast of searchData.results) {
      const podcastId = podcast.collectionId;
      const episodeResponse = await fetch(
        `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=5`
      );
      const episodeData = await episodeResponse.json();

      for (const episode of episodeData.results) {
        if (episode.kind === "podcast-episode" && episode.transcriptUrl && !usedLinks.has(episode.transcriptUrl)) {
          const transcriptResponse = await fetch(episode.transcriptUrl);
          const transcriptText = await transcriptResponse.text();

          transcriptResults.push({
            link: episode.episodeUrl,
            transcriptUrl: episode.transcriptUrl,
            transcript: transcriptText,
            title: episode.trackName,
            podcast: podcast.collectionName,
            platform: 'Apple Podcasts'
          });

          usedLinks.add(episode.transcriptUrl);
        }
      }
    }

    return transcriptResults;
  } catch (error) {
    console.error("Apple Podcast transcript fetch error:", error);
    return [];
  }
}

// Helper function to fetch content from multiple sources
async function fetchMultiSourceContent(identifier: string, existingClaims: HealthClaim[] = []) {
  try {
    const usedLinks = new Set(
      existingClaims.flatMap(claim => 
        Object.values(claim.sources).flat()
      )
    );

    const podcastTranscripts = await fetchApplePodcastTranscripts(identifier, usedLinks);

    const platformQueries = [
      { platform: 'youtube', query: `site:youtube.com ${identifier} health`, num: 10 },
      { platform: 'twitter', query: `site:twitter.com ${identifier} health`, num: 10 },
      { platform: 'blogs', query: `(site:medium.com OR site:hashnode.dev OR site:substack.com) ${identifier} health`, num: 10 }
    ];

    const searchRequests = platformQueries.map(({ query, num }) => 
      fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: query,
          num,
          gl: "us",
          hl: "en"
        })
      })
    );

    const responses = await Promise.all(searchRequests);
    const results = await Promise.all(responses.map(r => r.json()));

    const contentItems = podcastTranscripts.map(transcript => ({
      link: transcript.link,
      title: `${transcript.podcast}: ${transcript.title}`,
      snippet: transcript.transcript.substring(0, 500),
      platform: 'Apple Podcasts'
    }));

    results.forEach((result, index) => {
      const platform = platformQueries[index].platform;
      for (const item of result.organic) {
        if (item.link && !usedLinks.has(item.link)) {
          contentItems.push({
            link: item.link,
            title: item.title || '',
            snippet: item.snippet || '',
            platform
          });
          usedLinks.add(item.link);
          break;
        }
      }
    });

    const rawText = contentItems
      .map(item => `${item.title}\n${item.snippet}`)
      .join("\n")
      .substring(0, 15000);

    return {
      contentSources: contentItems.map(item => ({
        link: item.link,
        platform: item.platform
      })),
      rawText,
      usedLinks
    };
  } catch (error) {
    console.error("Content fetch error:", error);
    return { contentSources: [], rawText: '', usedLinks: new Set<string>() };
  }
}

// Helper function to fetch content for a specific claim
async function fetchContentForClaim(identifier: string, category: string, usedLinks: Set<string>) {
  try {
    const platformQueries = [
      { platform: 'youtube', query: `site:youtube.com ${identifier} ${category} health`, num: 5 },
      { platform: 'twitter', query: `site:twitter.com ${identifier} ${category} health`, num: 5 },
      { platform: 'blogs', query: `(site:medium.com OR site:hashnode.dev OR site:substack.com) ${identifier} ${category} health`, num: 5 },
      { platform: 'podcasts', query: `(site:podcasts.apple.com OR site:open.spotify.com) ${identifier} ${category} health`, num: 5 }
    ];

    const searchRequests = platformQueries.map(({ query, num }) => 
      serperLimit(() => fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: query,
          num,
          gl: "us",
          hl: "en"
        })
      })
    ));

    const responses = await Promise.all(searchRequests);
    const results = await Promise.all(responses.map(r => r.json()));

    const selectedContent: string[] = [];
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const unusedLink = result.organic?.find((item: any) => 
        item.link && !usedLinks.has(item.link)
      );
      
      if (unusedLink) {
        selectedContent.push(unusedLink.link);
        usedLinks.add(unusedLink.link);
      }
    }

    return selectedContent;
  } catch (error) {
    console.error("Content fetch error:", error);
    return [];
  }
}

async function batchCategorizeClaims(texts: string[]): Promise<{ category: HealthClaimCategory, confidence: number }[]> {
  try {
    const openaiRes = await openaiLimit(() => openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: "Categorize these claims into: Nutrition, Medicine, Mental Health, Fitness, Sleep, Performance, Neuroscience. Return a JSON array of category strings in the same order."
      }, {
        role: "user",
        content: JSON.stringify(texts)
      }],
      response_format: { type: "json_object" },
      max_tokens: 400
    }));

    const validCategories: HealthClaimCategory[] = [
      'Nutrition', 'Medicine', 'Mental Health', 
      'Fitness', 'Sleep', 'Performance', 'Neuroscience', 
      'Uncategorized'
    ];

    const getValidCategory = (input: string): HealthClaimCategory => {
      const cleanInput = input.replace(/['"]/g, '').trim();
      return validCategories.includes(cleanInput as HealthClaimCategory) 
        ? cleanInput as HealthClaimCategory 
        : 'Uncategorized';
    };

    const responseContent = openaiRes.choices[0]?.message?.content;
    if (!responseContent) {
      return texts.map(() => ({
        category: 'Uncategorized',
        confidence: 0
      }));
    }

    const parsedResponse = JSON.parse(responseContent);
    const categories = parsedResponse.categories || [];

    return texts.map((_, index) => {
      const category = getValidCategory(categories[index] || 'Uncategorized');
      return {
        category,
        confidence: category === 'Uncategorized' ? 0 : 100
      };
    });
  } catch (error) {
    console.error("Batch categorization error:", error);
    return texts.map(() => ({
      category: 'Uncategorized',
      confidence: 0
    }));
  }
}

// Batch verification function
async function batchVerifyClaims(claims: { content: string, category: HealthClaimCategory }[], influencerIdentifier: string, globalUsedLinks: Set<string>) {
  try {
    return await Promise.all(
      claims.map(async ({ content, category }) => {
        try {
          const contentSources = await fetchContentForClaim(influencerIdentifier, category, globalUsedLinks);

          const serperResponse = await serperLimit(() => fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
              "X-API-KEY": process.env.SERPER_API_KEY!,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              q: `${content} scientific research site:.gov OR site:.edu OR site:jamanetwork.com OR site:thelancet.com`,
              num: 2,
              gl: "us",
              hl: "en"
            })
          }));

          const serperData = await serperResponse.json();
          const scientificSources = serperData.organic
            ?.map((item: any) => item.link)
            ?.filter((link: string) => !globalUsedLinks.has(link)) || [];

          scientificSources.forEach((link: string) => globalUsedLinks.add(link));

          let status: VerificationStatus;
          if (scientificSources.length >= 2) {
            const contradictionCheck = await perplexityLimit(() => perplexity.chat.completions.create({
              model: "llama-3.1-sonar-small-128k-online",
              messages: [{
                role: "system",
                content: "Analyze if these sources support or contradict the claim. Response: SUPPORTS/CONTRADICTS"
              }, {
                role: "user",
                content: `Claim: ${content}\nSources: ${scientificSources.join(", ")}`
              }],
              max_tokens: 100
            }));

            const analysis = contradictionCheck.choices[0]?.message?.content?.trim().toUpperCase();
            status = analysis === 'CONTRADICTS' ? 'Debunked' : 'Verified';
          } else {
            status = 'Questionable';
          }

          return {
            id: `claim_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            content,
            category,
            verificationStatus: status,
            trustScore: calculateTrustScore(scientificSources, status),
            sources: {
              contentSources,
              scientificSources
            },
            influencerId: influencerIdentifier,
            createdAt: new Date(),
            analysis: status === 'Verified' 
              ? `Verified with ${scientificSources.length} trusted sources`
              : status === 'Debunked'
              ? "Scientific evidence contradicts this claim"
              : "Insufficient scientific evidence"
          };
        } catch (error) {
          console.error("Verification failed for claim:", error);
          return {
            id: `claim_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            content,
            category: "Uncategorized" as HealthClaimCategory,
            verificationStatus: "Questionable" as VerificationStatus,
            trustScore: 40,
            sources: {
              contentSources: [],
              scientificSources: []
            },
            influencerId: influencerIdentifier,
            createdAt: new Date(),
            analysis: "Verification failed due to API error"
          };
        }
      })
    );
  } catch (error) {
    console.error("Batch verification error:", error);
    return claims.map(({ content, category }) => ({
      id: `claim_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      content,
      category,
      verificationStatus: "Questionable" as VerificationStatus,
      trustScore: 40,
      sources: {
        contentSources: [],
        scientificSources: []
      },
      influencerId: influencerIdentifier,
      createdAt: new Date(),
      analysis: "Batch verification failed"
    }));
  }
}

// ProcessClaims function with batch processing
export async function processClaims(influencerIdentifier: string) {
  try {
    // Phase 1: Fetch and prepare content
    console.log("Phase 1: Fetching and preparing content...");
    const { rawText, usedLinks, contentSources } = await fetchMultiSourceContent(influencerIdentifier);

    if (!rawText) {
      throw new Error("No content found to analyze");
    }

    // Phase 2: Extract influencer details
    console.log("Phase 2: Extracting influencer details...");
    const influencerDetails = await extractInfluencerDetails(rawText, contentSources);

    // Phase 3: Extract and categorize claims
    console.log("Phase 3: Extracting and categorizing claims...");
    const extractionResponse = await perplexityLimit(() => perplexity.chat.completions.create({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [{
        role: "system",
        content: "Extract specific health claims as bullet points from this text. Format: - [claim]"
      }, {
        role: "user",
        content: rawText
      }],
      max_tokens: 2000
    }));

    const rawClaims = extractionResponse.choices[0]?.message?.content
      ?.split("\n")
      ?.filter(line => line.startsWith("- "))
      ?.map(line => line.substring(2)) || [];

    const embeddingResponse = await openaiLimit(() => openai.embeddings.create({
      model: "text-embedding-3-large",
      input: rawClaims,
    }));

    const uniqueClaims = embeddingResponse.data.reduce((acc, curr, index) => {
      const isDuplicate = acc.some(existing => 
        cosineSimilarity(curr.embedding, existing.embedding) > 0.85
      );
      if (!isDuplicate) {
        acc.push({ text: rawClaims[index], embedding: curr.embedding });
      }
      return acc;
    }, [] as { text: string; embedding: number[] }[]);

    // Batch categorization
    const textsToCategorize = uniqueClaims.map(claim => claim.text);
    const batchCategorizationResults = await batchCategorizeClaims(textsToCategorize);

    const categorizedClaims = uniqueClaims.map((claim, index) => ({
      content: claim.text,
      ...batchCategorizationResults[index]
    }));

    // Phase 4: Batch verification
    console.log("Phase 4: Verifying claims...");
    const globalUsedLinks = new Set<string>(usedLinks);
    const verifiedClaims = await batchVerifyClaims(
      categorizedClaims.map(({ content, category }) => ({ content, category })),
      influencerIdentifier,
      globalUsedLinks
    );

    // Phase 5: Save claims and update influencer stats
    console.log("Phase 5: Saving claims and updating influencer stats...");
    await saveClaimsToAppwrite(verifiedClaims, influencerIdentifier);
    await updateInfluencerStats(
      influencerIdentifier,
      {
        verifiedClaims: verifiedClaims.filter(c => c.verificationStatus === 'Verified').length,
        questionableClaims: verifiedClaims.filter(c => c.verificationStatus === 'Questionable').length,
        debunkedClaims: verifiedClaims.filter(c => c.verificationStatus === 'Debunked').length,
        totalClaims: verifiedClaims.length,
        averageTrustScore: verifiedClaims.reduce((sum, claim) => sum + claim.trustScore, 0) / verifiedClaims.length,
      },
      influencerDetails
    );

    return {
      success: true,
      claims: verifiedClaims,
      influencerDetails,
    };

  } catch (error) {
    console.error("Processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Processing failed"
    };
  }
}

// Helper function to extract influencer details
interface InfluencerDetails {
  name: string;
  handle: string;
  platform: string;
  followerCount: number;
  likes: number;
  comments: number;
  shares: number;
  avgViews: number;
  lastUploadDate: string;
  engagementRate: number;  // This will be a float
}

type NumericFields = 'likes' | 'comments' | 'shares' | 'avgViews' | 'followerCount';

async function extractInfluencerDetails(rawText: string, contentSources: any[]): Promise<InfluencerDetails> {
  try {
    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: `Extract the influencer's details as valid JSON without markdown formatting based on their name, handle, platform, follower count, likes count, comments count, shares, and average views from the provided text. 
        Required format: {
          "name": string,
          "handle": string,
          "platform": string,
          "followerCount": number,
          "likes": number,
          "comments": number,
          "shares": number,
          "avgViews": number,
          "lastUploadDate": string (ISO format)
        }`
      }, {
        role: "user",
        content: rawText,
      }],
      max_tokens: 300,
    });

    const extractedJson = extractionResponse.choices[0]?.message?.content;
    let influencerDetails: InfluencerDetails = {
      name: "Unknown Influencer",
      handle: "unknown_handle",
      platform: "Unknown Platform",
      followerCount: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      avgViews: 0,
      lastUploadDate: new Date().toISOString(),
      engagementRate: 0
    };

    if (extractedJson) {
      try {
        // Improved JSON extraction with multiple fallbacks
        let cleanedJson = extractedJson;
    
        // First try to extract JSON from code blocks
        const codeBlockMatch = cleanedJson.match(/```json\n([\s\S]*?)\n```/);
        if (codeBlockMatch) {
          cleanedJson = codeBlockMatch[1];
        } else {
          // Fallback 1: Remove any remaining backticks
          cleanedJson = cleanedJson.replace(/```/g, '');
          // Fallback 2: Extract first JSON object
          const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
          if (jsonMatch) cleanedJson = jsonMatch[0];
        }
    
        // Final cleanup and parse
        cleanedJson = cleanedJson.trim();
        const parsedData = JSON.parse(cleanedJson);
        
        // Extract basic details and metrics
        influencerDetails = {
          ...influencerDetails,
          name: parsedData.name || influencerDetails.name,
          handle: parsedData.handle || influencerDetails.handle,
          platform: parsedData.platform || influencerDetails.platform,
          followerCount: parsedData.followerCount || influencerDetails.followerCount,
          likes: parsedData.likes || influencerDetails.likes,
          comments: parsedData.comments || influencerDetails.comments,
          shares: parsedData.shares || influencerDetails.shares,
          avgViews: parsedData.avgViews || influencerDetails.avgViews,
          lastUploadDate: parsedData.lastUploadDate || influencerDetails.lastUploadDate
        };

        // Type-safe way to validate and clean up numeric metrics
        const numericFields: NumericFields[] = ['likes', 'comments', 'shares', 'avgViews', 'followerCount'];
        numericFields.forEach(key => {
          influencerDetails[key] = Math.max(0, Math.floor(influencerDetails[key]));
        });

        // Validate lastUploadDate
        if (!Date.parse(influencerDetails.lastUploadDate)) {
          influencerDetails.lastUploadDate = new Date().toISOString();
        }

      } catch (error) {
        console.error("Failed to parse extracted data:", error);
      }
    }

    if (influencerDetails.platform === "Unknown Platform") {
      const platforms = contentSources.map(source => source.platform);
      const mostCommonPlatform = platforms.reduce((acc, platform) => {
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      influencerDetails.platform = Object.keys(mostCommonPlatform).reduce((a, b) =>
        mostCommonPlatform[a] > mostCommonPlatform[b] ? a : b
      );
    }

    if (contentSources.length > 0) {
      const avgMetrics = contentSources.reduce((acc, source) => {
        return {
          likes: acc.likes + (source.likes || 0),
          comments: acc.comments + (source.comments || 0),
          shares: acc.shares + (source.shares || 0),
          views: acc.views + (source.views || 0)
        };
      }, { likes: 0, comments: 0, shares: 0, views: 0 });

      const sourceCount = contentSources.length;
      
      if (influencerDetails.likes === 0) {
        influencerDetails.likes = Math.floor(avgMetrics.likes / sourceCount);
      }
      if (influencerDetails.comments === 0) {
        influencerDetails.comments = Math.floor(avgMetrics.comments / sourceCount);
      }
      if (influencerDetails.shares === 0) {
        influencerDetails.shares = Math.floor(avgMetrics.shares / sourceCount);
      }
      if (influencerDetails.avgViews === 0) {
        influencerDetails.avgViews = Math.floor(avgMetrics.views / sourceCount);
      }

      const latestSource = contentSources
        .filter(source => source.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (latestSource?.date) {
        influencerDetails.lastUploadDate = new Date(latestSource.date).toISOString();
      }
    }

    // Calculate engagement rate
    const calculateEngagementRate = (metrics: InfluencerDetails): number => {
      if (metrics.followerCount === 0) return 0;
      
      switch (metrics.platform.toLowerCase()) {
        case 'instagram':
          return ((metrics.likes + metrics.comments) / metrics.followerCount) * 100;
        
        case 'youtube':
          return metrics.avgViews ? ((metrics.likes + metrics.comments) / metrics.avgViews) * 100 : 0;
        
        case 'twitter':
          return metrics.avgViews ? 
            ((metrics.likes + metrics.comments + metrics.shares) / metrics.avgViews) * 100 : 0;
        
        case 'tiktok':
          return metrics.avgViews ? 
            ((metrics.likes + metrics.comments + metrics.shares) / metrics.avgViews) * 100 : 0;
        
        default:
          return ((metrics.likes + metrics.comments + metrics.shares) / metrics.followerCount) * 100;
      }
    };

    // Calculate and set the engagement rate
    influencerDetails.engagementRate = Number(calculateEngagementRate(influencerDetails).toFixed(2));

    return influencerDetails;

  } catch (error) {
    console.error("Error extracting influencer details:", error);
    return {
      name: "Unknown Influencer",
      handle: "unknown_handle",
      platform: "Unknown Platform",
      followerCount: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      avgViews: 0,
      lastUploadDate: new Date().toISOString(),
      engagementRate: 0
    };
  }
}
