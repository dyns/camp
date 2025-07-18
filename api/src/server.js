// Import the framework and instantiate it
import Fastify from "fastify";

import { PrismaClient } from "@prisma/client";
import path from "node:path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const srcDirname = path.dirname(__filename);
const __dirname2 = path.dirname(srcDirname);

const prisma = new PrismaClient();

const fastify = Fastify({
  logger: true,
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

// Run the server!
try {
  // await fastify.listen({ port: 3000 });
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
