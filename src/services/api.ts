import { Quote } from '../types';

const QUOTES_URL = 'https://api.quotable.io/random?tags=inspirational,motivation';

export async function fetchRandomQuote(): Promise<Quote> {
  const response = await fetch(QUOTES_URL);
  if (!response.ok) throw new Error('Failed to fetch quote');
  const data = await response.json();
  return { content: data.content, author: data.author };
}
