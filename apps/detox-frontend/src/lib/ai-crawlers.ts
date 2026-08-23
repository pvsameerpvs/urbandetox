/**
 * AI crawler policy, as a business decision with the tradeoff written down.
 *
 * The single most useful fact here: for the big operators, TRAINING and
 * ANSWER-TIME RETRIEVAL are different user agents. Blocking the training
 * crawler does not remove you from the product's answers, and blocking the
 * retrieval crawler does. Most "block the AI bots" advice conflates the two and
 * quietly costs the site its citations.
 *
 * TRAINING_ONLY   — corpus collection for model training. Disallowing these has
 *                   no known effect on whether the product cites you.
 * RETRIEVAL       — fetches pages to answer a question now, and is what earns a
 *                   citation with a link back. Disallowing these removes you
 *                   from that product's answers.
 *
 * Two things worth knowing before choosing:
 *
 * 1. Google-Extended is not a crawler and has no separate index. It is a
 *    control over Gemini/Vertex training use only. Google AI Overviews are
 *    built from the ordinary Search index, so disallowing Google-Extended does
 *    NOT keep the site out of AI Overviews and does NOT affect Search ranking.
 *    Opting out of AI Overviews means `nosnippet` / `max-snippet`, which also
 *    removes the ordinary search snippet — a much worse trade for a business
 *    that needs the clicks.
 * 2. robots.txt is voluntary. It reliably stops the operators that publish
 *    their user agents and honour the file; it stops nobody else.
 */

/** Corpus collection for model training. No citation upside. */
export const TRAINING_ONLY = [
  // OpenAI's training crawler. Not the one behind ChatGPT's answers.
  "GPTBot",
  // Common Crawl. Feeds many third-party training sets, no product of its own.
  "CCBot",
  // Meta's training crawler.
  "meta-externalagent",
  // ByteDance.
  "Bytespider",
  // Apple Intelligence training. Applebot itself is Siri/Spotlight search.
  "Applebot-Extended",
  // Not a crawler: a Gemini/Vertex training opt-out token. See note 1 above.
  "Google-Extended",
] as const;

/** Fetches pages to answer a live question, and cites the source. */
export const RETRIEVAL = [
  // OpenAI's search index — this is what ChatGPT's answers and citations use.
  "OAI-SearchBot",
  // ChatGPT fetching a page because a user's question needs it right now.
  "ChatGPT-User",
  // Anthropic's search index, and Claude fetching on a user's behalf.
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity's index, and its on-demand fetch.
  "PerplexityBot",
  "Perplexity-User",
  // Microsoft Copilot. Bingbot also feeds Copilot, so blocking only this one
  // does not remove the site from Copilot answers.
  "MicrosoftPreview",
] as const;

/**
 * Anthropic's general crawler. Listed separately because it is genuinely
 * ambiguous: it collects for training, and Anthropic documents it as the agent
 * behind Claude's web access. Blocking it is the one choice here with an
 * unclear citation cost.
 */
export const AMBIGUOUS = ["ClaudeBot"] as const;

/**
 * Which of the above to disallow. Set NEXT_PUBLIC_AI_CRAWLER_POLICY in Railway.
 *
 *   "open"          (default) — nothing is disallowed. Maximum visibility in AI
 *                   answers; the content is also available for training.
 *   "no-training"   — disallow TRAINING_ONLY, keep RETRIEVAL and ClaudeBot.
 *                   Keeps every citation path open while opting out of the
 *                   training uses that offer nothing back. This is the option
 *                   most travel businesses want, but it is a call about how the
 *                   content should be used, not a technical optimisation.
 *   "no-training-strict" — as above, plus ClaudeBot.
 *   "closed"        — disallow all three groups. Removes the site from ChatGPT,
 *                   Claude and Perplexity answers. Choose this only if being
 *                   quoted is unwanted; it forfeits a channel that sends
 *                   high-intent traffic to a trip-booking site.
 *
 * Note that "closed" does not remove the site from Google AI Overviews, for the
 * reason in note 1. No robots.txt setting does.
 */
export type AiCrawlerPolicy =
  | "open"
  | "no-training"
  | "no-training-strict"
  | "closed";

export function aiCrawlerPolicy(): AiCrawlerPolicy {
  const raw = process.env.NEXT_PUBLIC_AI_CRAWLER_POLICY?.trim();
  switch (raw) {
    case "no-training":
    case "no-training-strict":
    case "closed":
      return raw;
    default:
      // Unset or misspelled falls through to today's behaviour, so a typo in
      // the Railway dashboard can never silently de-list the site.
      return "open";
  }
}

/** User agents to disallow entirely, for the active policy. */
export function blockedAiAgents(policy = aiCrawlerPolicy()): string[] {
  switch (policy) {
    case "no-training":
      return [...TRAINING_ONLY];
    case "no-training-strict":
      return [...TRAINING_ONLY, ...AMBIGUOUS];
    case "closed":
      return [...TRAINING_ONLY, ...AMBIGUOUS, ...RETRIEVAL];
    case "open":
    default:
      return [];
  }
}
