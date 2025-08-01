import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../lib/middleware.js";

export default async function routes(fastify) {
  fastify.addHook("preHandler", authMiddleware);

  fastify.get("/", async function handler(request, reply) {
    return await prisma.user.findMany();
    // return "these are the users";
  });

  fastify.post("/search", async function searchUser(request, reply) {
    const { email } = request.body;

    try {
      const user = await prisma.user.findUniqueOrThrow({ where: { email } });

      return { user: { email: user.email } };
    } catch {
      return reply.status(404).send({ error: "User not found" });
    }
  });

  fastify.get("/me", async function getUser(request) {
    const currentUser = request.user;
    return { user: currentUser };
  });

  fastify.patch("/me", async function updateSessionUser(request) {
    const currentUser = request.user;

    const data = request.body || {};

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data,
    });

    return { user };
  });
}
