FROM node:20-alpine

WORKDIR /app

COPY ./prisma ./prisma
COPY ./src ./src

COPY  package.json package-lock.json nodemon.json ./

RUN npm ci

RUN npx prisma generate
