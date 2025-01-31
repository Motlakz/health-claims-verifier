import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TRUSTED_JOURNAL_DOMAINS } from "./integrations/sources";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
  }).format(date)
}

export function calculateTrustScore(sources: string[], status: string): number {
  const trustedSources = sources.filter(url => {
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, '');
      return TRUSTED_JOURNAL_DOMAINS.has(hostname);
    } catch {
      return false;
    }
  });

  let score = status === "Verified" ? 70 : 30;
  score += trustedSources.length * 20;
  return Math.min(100, Math.max(0, score));
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay = 500
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxRetries) throw error;
      const delay = baseDelay * 2 ** attempt;
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
}

export function cosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}