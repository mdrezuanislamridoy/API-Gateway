FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY app/auth-service/tsconfig.json app/auth-service/tsconfig.build.json ./app/auth-service/
COPY app/auth-service/prisma.config.ts ./app/auth-service/
COPY app/auth-service/prisma ./app/auth-service/prisma
COPY app/auth-service/src ./app/auth-service/src

RUN pnpm install --frozen-lockfile

# Prisma config reads DATABASE_URL during client generation.
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db?schema=public
RUN pnpm exec prisma generate --config app/auth-service/prisma.config.ts
RUN pnpm exec tsc -p app/auth-service/tsconfig.build.json
RUN pnpm prune --prod

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/auth-service/dist ./app/auth-service/dist

EXPOSE 3001

CMD ["node", "app/auth-service/dist/main.js"]

