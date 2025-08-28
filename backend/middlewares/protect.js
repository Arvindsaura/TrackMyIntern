import { getAuth } from "@clerk/express";

export const protect = (req, res, next) => {
  try {
    const { userId, firstName, lastName, emailAddress } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized, login required" });
    }

    req.auth = {
      userId,
      name: `${firstName || ""} ${lastName || ""}`.trim() || "No Name",
      email: emailAddress?.[0]?.emailAddress || `noemail_${Date.now()}@example.com`,
    };

    next();
  } catch (error) {
    console.error("Clerk auth failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
