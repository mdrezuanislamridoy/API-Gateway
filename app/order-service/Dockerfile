FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY app/order-service/tsconfig.json app/order-service/tsconfig.build.json ./app/order-service/
COPY app/order-service/prisma.config.ts ./app/order-service/
COPY app/order-service/prisma ./app/order-service/prisma
COPY app/order-service/src ./app/order-service/src

RUN pnpm install --frozen-lockfile

ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/order_db?schema=public
RUN pnpm exec prisma generate --config app/order-service/prisma.config.ts
RUN pnpm exec tsc -p app/order-service/tsconfig.build.json
RUN pnpm prune --prod

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/order-service/dist ./app/order-service/dist

EXPOSE 3003

CMD ["node", "app/order-service/dist/main.js"]