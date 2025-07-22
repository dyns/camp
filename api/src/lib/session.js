import jwt from "jsonwebtoken";

export const COOKIE_SECRET = "MY_SECRET";

export const SESSION_COOKIE_NAME = "session";

export function createUserSessionCookie(userId) {
  return jwt.sign({ userId }, COOKIE_SECRET, { expiresIn: "1w" });
}
