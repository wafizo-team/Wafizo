# ─── Build ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/landing/package.json ./apps/landing/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY apps/landing ./apps/landing
COPY tsconfig.base.json ./

RUN pnpm --filter landing build

# ─── Production ───────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

COPY --from=builder /app/apps/landing/dist /usr/share/nginx/html

COPY apps/landing/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
