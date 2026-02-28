FROM node:18-alpine AS builder

WORKDIR /app
# Copy root package details
COPY package.json package-lock.json tsconfig.json ./
# Copy workspace packages
COPY packages/shared/package.json packages/shared/package.json
COPY apps/backend/package.json apps/backend/package.json

# Install dependencies (workspaces context)
RUN npm ci

# Copy source code
COPY packages/shared packages/shared
COPY apps/backend apps/backend

# Build shared and backend
RUN npm run build -w @cipherlab/shared
RUN npm run build -w @cipherlab/backend

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/shared/package.json packages/shared/
COPY --from=builder /app/apps/backend/package.json apps/backend/

# Only install prod
RUN npm ci --omit=dev

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/backend/dist apps/backend/dist

EXPOSE 3000
CMD ["npm", "start", "-w", "@cipherlab/backend"]
