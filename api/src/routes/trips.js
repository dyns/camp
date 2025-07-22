import { prisma } from "../lib/prisma.js";

export default async function routes(fastify) {
  fastify.post("/", async function handler(req, reply) {
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
}
