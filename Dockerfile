# Stage 1: Builder
FROM node:lts-alpine AS builder
WORKDIR /usr/src/app

# Install build dependencies for native modules (needed for flowise-embed-react and other packages)
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
# Using --legacy-peer-deps to resolve conflict between React 19 and flowise-embed-react (requires React 18)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Set production environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application (this creates the standalone output)
RUN npm run build

# Stage 2: Runner
FROM node:lts-alpine AS runner
WORKDIR /usr/src/app

# Install runtime dependencies for flowise-embed-react compatibility
RUN apk add --no-cache libc6-compat

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder
# The standalone output includes only the necessary files for production
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application using the standalone server
CMD ["node", "server.js"]