# ── Stage 1: Build ──────────────────────────────────────────────────────────
# Build context phải là thư mục cha (d:\Figma), vì vite alias @mds → ../mds-ui/src
# Lệnh build: docker build -f ketoan-dashboard/Dockerfile -t ketoan-dashboard:latest .
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared UI library (ít thay đổi → tận dụng cache layer)
COPY mds-ui ./mds-ui

# Copy package files trước để cache layer npm install
WORKDIR /app/ketoan-dashboard
COPY ketoan-dashboard/package.json ketoan-dashboard/package-lock.json* ./
RUN npm ci --prefer-offline

# Copy toàn bộ source (node_modules đã cài xong, .dockerignore loại trừ node_modules)
COPY ketoan-dashboard/ ./

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY ketoan-dashboard/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/ketoan-dashboard/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
