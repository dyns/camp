import jwt from "jsonwebtoken";

import { prisma } from "./prisma.js";
import { SESSION_COOKIE_NAME, COOKIE_SECRET } from "./session.js";

export async function authMiddleware(request, reply) {
  try {
    const sessionCookie = request.cookies[SESSION_COOKIE_NAME];
    if (!sessionCookie) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(sessionCookie, COOKIE_SECRET);
      const userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      request.user = user;
    } catch {
      return reply.status(401).send({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return reply.status(401).send({ error: "Unauthorized" });
  }
}
