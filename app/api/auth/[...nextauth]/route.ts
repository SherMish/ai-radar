import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error("[NextAuth API Error]:", error);
    
    // Send error to logging service or email
    fetch(process.env.NEXT_PUBLIC_APP_URL + "/api/log-auth-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error, request: req.url }),
    });

    return res.status(500).json({ message: "Authentication error occurred" });
  }
};

export { handler as GET, handler as POST };