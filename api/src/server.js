// Import the framework and instantiate it
import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import fastifyCors from "@fastify/cors";
import jwt from "jsonwebtoken";

// file upload imports
import fs from "fs";
import { pipeline } from "stream/promises";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const srcDirname = path.dirname(__filename);
const __dirname2 = path.dirname(srcDirname);

const COOKIE_SECRET = "MY_SECRET";

const prisma = new PrismaClient();

const SESSION_COOKIE_NAME = "session";
function createUserSessionCookie(userId) {
  return jwt.sign({ userId }, COOKIE_SECRET, { expiresIn: "1w" });
}

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: "http://localhost:5173", // Your React/Vite UI origin
  credentials: true, // Allow cookies
});

fastify.register(import("@fastify/multipart"));

fastify.register(import("@fastify/cookie"));

fastify.post("/auth/signup", async (request, reply) => {
  const { password } = request.body;
  let { name, email } = request.body;
  name = name?.trim();
  email = email?.trim();
  if (
    !name ||
    !password ||
    !email ||
    name.trim() === "" ||
    password.trim() === "" ||
    email.trim() === ""
  ) {
    return reply.status(400).send({
      error: "name, email, and password are required",
      data: request.body,
    });
  }

  if (name.length < 3 || password.length < 3) {
    return reply.status(400).send({
      error:
        "Name must be at least 3 characters and password at least 6 characters",
    });
  }

  const user = await prisma.user.create({
    data: { name, password, email },
  });

  // const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: "1w" });
  const session = createUserSessionCookie(user.id);

  reply.setCookie(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  return { success: true };
});

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

fastify.post("/auth/signin", async (request, reply) => {
  const { email, password } = request.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  // Validate password
  const isPasswordValid = password === user.password;

  const session = createUserSessionCookie(user.id);

  reply.setCookie(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  return { success: true };
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world update" };
});

// Declare a route
fastify.get("/users", async function handler(request, reply) {
  return await prisma.user.findMany();
  // return "these are the users";
});

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

fastify.post("/trips", async function handler(req, reply) {
  // create trip model
  const trip = await prisma.trip.create({
    data: {
      name: "trip test",
      description: "my description",
      startDate: new Date(),
      owners: {
        connect: [{ id: 1 }],
      },
      categories: {
        create: [
          {
            name: "Pre Trip",
            description: "Let's plan where we are going and when 🏕️",
          },
          {
            name: "Supplies",
            description: "What do we need to bring? 🧳",
          },
          {
            name: "Travel",
            description:
              "Let's figure out carpooling and who is driving 🚗. When are we taking off?",
          },
          {
            name: "Activities",
            description: "What are we doing there? 🏞️",
          },
        ],
      },
    },
  });

  // create default categories
  // commit to database together

  return { tripData: trip };
});

// Run the server!
try {
  // await fastify.listen({ port: 3000 });
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
