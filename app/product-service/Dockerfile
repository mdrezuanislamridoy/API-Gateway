FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY app/product-service/tsconfig.json app/product-service/tsconfig.build.json ./app/product-service/
COPY app/product-service/prisma.config.ts ./app/product-service/
COPY app/product-service/prisma ./app/product-service/prisma
COPY app/product-service/src ./app/product-service/src

RUN pnpm install --frozen-lockfile

ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/product_db?schema=public
RUN pnpm exec prisma generate --config app/product-service/prisma.config.ts
RUN pnpm exec tsc -p app/product-service/tsconfig.build.json
RUN pnpm prune --prod

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/product-service/dist ./app/product-service/dist

EXPOSE 3002

CMD ["node", "app/product-service/dist/main.js"]
