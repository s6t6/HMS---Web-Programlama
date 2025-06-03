FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npm ci && npm rebuild better-sqlite3 && node index.js"]
