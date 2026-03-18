# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

# Stage 2: Runtime
FROM node:20-slim AS runtime
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/drizzle ./drizzle
COPY package.json ./

ENV PORT=8472
ENV DATABASE_URL=/app/data/fixedflow.db

EXPOSE 8472

CMD ["node", "build"]
