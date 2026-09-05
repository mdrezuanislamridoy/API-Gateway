FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY app/api-gateway/tsconfig.json app/api-gateway/tsconfig.build.json ./app/api-gateway/
COPY app/api-gateway/src ./app/api-gateway/src

RUN pnpm install --frozen-lockfile

RUN pnpm exec tsc -p app/api-gateway/tsconfig.build.json
RUN pnpm prune --prod

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/api-gateway/dist ./app/api-gateway/dist

EXPOSE 3000

CMD ["node", "app/api-gateway/dist/main.js"]
