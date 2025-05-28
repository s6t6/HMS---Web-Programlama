FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm rebuild better-sqlite3

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]