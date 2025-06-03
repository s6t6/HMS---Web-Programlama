FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 5174

CMD ["sh", "-c", "npm ci && npm run dev -- --host 0.0.0.0 --port 5174"]