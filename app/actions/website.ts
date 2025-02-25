"use server";

import { Website } from "@/lib/models";

export async function fetchLatestWebsites(limit: number = 2) {
  try {
    const websites = await Website.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();


    return websites;
  } catch (error) {
    console.error("Error fetching latest websites:", error);
    return [];
  }
} 