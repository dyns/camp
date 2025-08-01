import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../lib/middleware.js";

export default async function routes(fastify) {
  fastify.addHook("preHandler", authMiddleware);

  fastify.get("/", async function handler(req, resp) {
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          {
            guests: {
              some: {
                id: req.user.id,
              },
            },
          },
          {
            owners: {
              some: {
                id: req.user.id,
              },
            },
          },
        ],
      },
    });

    console.log("trips prisma", JSON.stringify(trips));
    return { trips };
  });

  fastify.get(
    "/:tripId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            tripId: { type: "integer" },
          },
          required: ["tripId"],
        },
      },
    },
    async function handler(req, resp) {
      const { tripId } = req.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          categories: {
            include: {
              tasks: { take: 5, orderBy: { id: "asc" } },
            },
          },
          guests: true,
        },
      });

      return { trip: trip };
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
    async function handler(request) {
      const { id } = request.params;
      const data = request.body || {};

      // add invited guest logic
      const guestEmails = data["guestEmails"];

      if (guestEmails !== undefined || guestEmails !== null) {
        const guestUsers = await prisma.user.findMany({
          where: { email: { in: guestEmails } },
          select: { id: true },
        });

        data["guests"] = { set: guestUsers };
      }

      if (data.startDate) {
        data["startDate"] = new Date(data.startDate);
      }

      delete data["guestEmails"];

      const trip = await prisma.trip.update({
        where: { id: id },
        include: { guests: true },
        data,
      });

      return { trip: trip };
    }
  );

  fastify.post("/", async function handler(request, reply) {
    const data = request.body || {};

    // create trip model
    const trip = await prisma.trip.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        owners: {
          connect: [{ id: request.user.id }],
        },
        guests: {
          connect: data.guestEmails.map((email) => ({ email })),
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

    return { trip: trip };
  });
}
