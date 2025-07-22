import { fastify } from "../lib/server.js";
import tripsRoutes from "./trips.js";
import usersRoutes from "./users.js";
import authRoutes from "./auth.js";

fastify.register(usersRoutes, { prefix: "/users" });
fastify.register(tripsRoutes, { prefix: "/trips" });
fastify.register(authRoutes, { prefix: "/auth" });
