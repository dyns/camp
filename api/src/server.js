import path from "path";
import { fileURLToPath } from "url";
import fastifyCors from "@fastify/cors";

// file upload imports
import fs from "fs";
import { pipeline } from "stream/promises";

import { prisma } from "./lib/prisma.js";
import { fastify } from "./lib/server.js";
import { SESSION_COOKIE_NAME, COOKIE_SECRET } from "./lib/session.js";

import "./routes/index.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const srcDirname = path.dirname(__filename);
const __dirname2 = path.dirname(srcDirname);

fastify.register(fastifyCors, {
  origin: "http://localhost:5173", // Your React/Vite UI origin
  credentials: true, // Allow cookies
});

fastify.register(import("@fastify/multipart"));

fastify.register(import("@fastify/cookie"));

async function authMiddleware(request, reply) {
  console.log("\n\n authMiddleware called", JSON.stringify(request.headers));
  try {
    const sessionCookie = request.cookies[SESSION_COOKIE_NAME];
    console.log("authMiddleware sessionCookie", sessionCookie);
    if (!sessionCookie) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(sessionCookie, COOKIE_SECRET);
      const userId = decoded.userId;
      console.log("authMiddleware decoded", decoded);

      // request.user = { id: userId };
      // Find user
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

const staticPath = path.join(__dirname2, "uploads");
console.log({ staticPath });
// serve static files
fastify.register(import("@fastify/static"), {
  root: path.join(__dirname2, "uploads"),
  prefix: "/uploads/",
});

fastify.post("/users/profile-image", async function (req, reply) {
  const data = await req.file();
  const uploadPath = path.join(process.cwd(), "uploads", data.filename);
  await pipeline(data.file, fs.createWriteStream(uploadPath));
  return { url: `/uploads/${data.filename}` };
});

// Protected routes (with auth)
fastify.register(async function (protectedRoutes) {
  protectedRoutes.addHook("preHandler", authMiddleware);

  protectedRoutes.get("/auth/me", async (request, reply) => {
    return { userId: request.user.id, user: request.user };
  });

  protectedRoutes.get("/check-auth", async (request, reply) => {
    try {
      return {
        authenticated: true,
        userId: request.user.id,
        user: request.user,
      };
    } catch {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
});

// Run the server!
try {
  // await fastify.listen({ port: 3000 });
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
