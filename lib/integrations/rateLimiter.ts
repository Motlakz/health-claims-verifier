import pLimit from 'p-limit';

export const serperLimit = pLimit(5); // Limit to 5 concurrent Serper API requests
export const openaiLimit = pLimit(3); // Limit to 3 concurrent OpenAI API requests
export const perplexityLimit = pLimit(3); // Limit to 3 concurrent Perplexity API requests
export const deepseekLimit = pLimit(3); // Limit to 3 concurrent Deepseek API requests
