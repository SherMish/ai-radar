"use server";

import { Website } from "@/lib/models";
import connectDB from '@/lib/mongodb';
import { WebsiteType } from '@/lib/models/Website';

export async function fetchLatestWebsites(limit: number = 2) {

  await connectDB();
  
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

export async function checkWebsiteExists(url: string): Promise<WebsiteType | null> {
  await connectDB();
  
  // Clean the URL to match our storage format
  const cleanUrl = url
    .toLowerCase()
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
    .split('/')[0]
    .split(':')[0];

  const website = await Website.findOne({ url: cleanUrl }).lean();
  if (website) {
    return {
      ...website,
      _id: website._id.toString(),
      createdBy: website.createdBy.toString(),
      owner: website.owner?.toString(),
    } as WebsiteType;
  }
  return null;
} 