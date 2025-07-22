import { prisma } from "../lib/prisma.js";
import {
  SESSION_COOKIE_NAME,
  createUserSessionCookie,
} from "../lib/session.js";

export default async function routes(fastify) {
  fastify.post("/signup", async (request, reply) => {
    const { password } = request.body;
    let { name, email } = request.body;
    name = name?.trim();
    email = email?.trim();
    if (
      !name ||
      !password ||
      !email ||
      name.trim() === "" ||
      password.trim() === "" ||
      email.trim() === ""
    ) {
      return reply.status(400).send({
        error: "name, email, and password are required",
        data: request.body,
      });
    }

    if (name.length < 3 || password.length < 3) {
      return reply.status(400).send({
        error:
          "Name must be at least 3 characters and password at least 6 characters",
      });
    }

    const user = await prisma.user.create({
      data: { name, password, email },
    });

    // const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: "1w" });
    const session = createUserSessionCookie(user.id);

    reply.setCookie(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    return { success: true };
  });

  fastify.post("/signin", async (request, reply) => {
    const { email, password } = request.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    // Validate password
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const session = createUserSessionCookie(user.id);

    reply.setCookie(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    return { success: true };
  });
}
