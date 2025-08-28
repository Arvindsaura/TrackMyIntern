import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized, login required" });
    }

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    req.auth = {
      userId,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "No Name",
      email: user.emailAddresses?.[0]?.emailAddress || `noemail_${Date.now()}@example.com`,
    };

    next();
  } catch (error) {
    console.error("Clerk auth failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
