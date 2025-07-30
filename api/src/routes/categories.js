import { prisma } from "../lib/prisma.js";

export default async function routes(fastify) {
  fastify.post("/", async (request) => {
    const { name, tripId, description } = request.body;

    const category = await prisma.TripTaskCategory.create({
      data: { name, tripId, description },
    });

    return { category };
  });
}
