import { Request, Response } from "express";
import { ENV } from "@/config/env";

interface GoogleApiReview {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

interface GoogleApiResult {
  rating?: number;
  user_ratings_total?: number;
  url?: string;
  reviews?: GoogleApiReview[];
}

interface GoogleApiResponse {
  status: string;
  result?: GoogleApiResult;
}

export const GoogleReviewsController = {
  async list(_req: Request, res: Response) {
    const { GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID } = ENV;

    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
      return res.json({ reviews: [], rating: 0, total: 0, url: "" });
    }

    try {
      const apiUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      apiUrl.searchParams.set("place_id", GOOGLE_PLACE_ID);
      apiUrl.searchParams.set("fields", "rating,reviews,user_ratings_total,url");
      apiUrl.searchParams.set("key", GOOGLE_PLACES_API_KEY);

      const response = await fetch(apiUrl.toString());
      const data = (await response.json()) as GoogleApiResponse;

      if (data.status !== "OK") {
        return res.status(500).json({
          error: data.status,
          reviews: [],
          rating: 0,
          total: 0,
          url: "",
        });
      }

      const result = data.result || {};
      const reviews = (result.reviews || []).slice(0, 4).map((r) => ({
        name: r.author_name,
        avatar: r.profile_photo_url,
        rating: r.rating,
        text: r.text,
        relativeTime: r.relative_time_description,
      }));

      res.json({
        reviews,
        rating: result.rating || 0,
        total: result.user_ratings_total || 0,
        url: result.url || "",
      });
    } catch {
      res.status(500).json({
        error: "Failed to fetch Google reviews",
        reviews: [],
        rating: 0,
        total: 0,
        url: "",
      });
    }
  },
} as const;
