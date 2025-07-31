import { prisma } from "../lib/prisma.js";

export default async function routes(fastify) {
  fastify.post("/", async (request) => {
    const { name, tripId, description } = request.body;

    const category = await prisma.TripTaskCategory.create({
      data: { name, tripId, description },
    });

    return { category };
  });

  fastify.get(
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
    async (request) => {
      const { id } = request.params;

      const category = await prisma.TripTaskCategory.findUnique({
        where: { id },
        include: {
          trip: { select: { id: true, name: true } },
        },
      });

      // Query completed and uncompleted tasks for this category
      const completedTasks = await prisma.Task.findMany({
        where: { categoryId: id, complete: true },
      });
      const uncompletedTasks = await prisma.Task.findMany({
        where: { categoryId: id, complete: false },
      });

      // Attach to category object
      category.completedTasks = completedTasks;
      category.uncompletedTasks = uncompletedTasks;

      return { category };
    }
  );

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
    async function updateCategory(request) {
      const { id } = request.params;

      const data = request.body || {};

      const category = await prisma.TripTaskCategory.update({
        where: { id },
        data,
      });

      return { category: category };
    }
  );
}
