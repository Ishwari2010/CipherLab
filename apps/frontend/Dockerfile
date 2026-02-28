FROM node:18-alpine AS builder

WORKDIR /app
# Copy root setup
COPY package.json package-lock.json tsconfig.json ./
# Copy workspaces
COPY packages/shared/package.json packages/shared/
COPY apps/frontend/package.json apps/frontend/

RUN npm ci

# Copy sources
COPY packages/shared packages/shared
COPY apps/frontend apps/frontend

# Build shared first, then frontend
RUN npm run build -w @cipherlab/shared
RUN npm run build -w @cipherlab/frontend

# Serve using nginx
FROM nginx:alpine
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
