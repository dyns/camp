import bcrypt, { compare } from "bcrypt";

const saltRounds = 12;

export async function hashPass(plainTextPass) {
  return await bcrypt.hash(plainTextPass, saltRounds);
}

export async function comparePass(plainTextPass, hashedPass) {
  return await bcrypt.compare(plainTextPass, hashedPass);
}
