import { prisma } from "../lib/prisma.js";

export default async function routes(fastify) {
  fastify.get("/", async function handler(request, reply) {
    return await prisma.user.findMany();
    // return "these are the users";
  });
}
