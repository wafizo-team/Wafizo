# ─── Build ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
COPY tsconfig.base.json ./

RUN pnpm --filter @wafizo/shared build
RUN pnpm --filter web build

# ─── Production ───────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Copie du build Vite vers le dossier servi par nginx
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Config nginx pour le routing React (SPA)
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
