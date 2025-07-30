import path from "path";
import { fileURLToPath } from "url";
import fastifyCors from "@fastify/cors";

// file upload imports
import fs from "fs";
import { pipeline } from "stream/promises";

import { prisma } from "./lib/prisma.js";
import { fastify } from "./lib/server.js";
import { SESSION_COOKIE_NAME, COOKIE_SECRET } from "./lib/session.js";
import { authMiddleware } from "./lib/middleware.js";
import "./routes/index.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const srcDirname = path.dirname(__filename);
const __dirname2 = path.dirname(srcDirname);

fastify.register(fastifyCors, {
  origin: "http://localhost:5173", // Your React/Vite UI origin
  credentials: true, // Allow cookies
  methods: ["GET", "HEAD", "POST", "PATCH", "DELETE"],
});

fastify.register(import("@fastify/multipart"));

fastify.register(import("@fastify/cookie"));

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
