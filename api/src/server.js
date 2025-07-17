// Import the framework and instantiate it
import Fastify from "fastify";

import { PrismaClient } from "@prisma/client";

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

// Run the server!
try {
  // await fastify.listen({ port: 3000 });
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
