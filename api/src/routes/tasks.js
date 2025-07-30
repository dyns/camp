import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../lib/middleware.js";

export default async function routes(fastify) {
  fastify.addHook("preHandler", authMiddleware);

  fastify.post("/", async (request, resp) => {
    const { name, categoryId } = request.body;

    const createdTask = await prisma.task.create({
      data: { name, categoryId },
      include: { category: { select: { tripId: true } } },
    });

    return { task: createdTask };
  });

  fastify.patch(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
      },
    },
    async (request, response) => {
      const { id } = request.params;
      const data = request.body || {};

      console.log("task patch", id, typeof id, data);
      const updated = await prisma.task.update({
        where: { id },
        data,
        include: { category: { select: { tripId: true } } },
      });

      return { task: updated };
    }
  );
}
