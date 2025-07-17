FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Install nodemon globally for dev
RUN npm install --global nodemon

CMD [ "npm", "run", "dev" ]
# CMD ["nodemon", "--watch", "src", "--ext", "js,json", "src/index.js"]