const PLACEHOLDER = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop";

export function safeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return PLACEHOLDER;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") || url.startsWith("data:image")) return url;
  return PLACEHOLDER;
}
