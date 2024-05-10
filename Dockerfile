FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# for dev mode
RUN apk add git git-lfs procps htop vim nano

RUN apk add alpine-sdk pkgconfig

# For FFMPEG and gl concat
RUN apk add curl python3 python3-dev libx11-dev libsm-dev libxrender libxext-dev mesa-dev xvfb libxi-dev glew-dev

RUN apk add --no-cache ffmpeg

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --force; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Uncomment the following lines if you want to use a secret at buildtime, 
# for example to access your private npm packages
# RUN --mount=type=secret,id=HF_EXAMPLE_SECRET,mode=0444,required=true \
#     $(cat /run/secrets/HF_EXAMPLE_SECRET)

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# If you use yarn, comment out this line and use the line above
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/cache ./.next/cache
# COPY --from=builder --chown=nextjs:nodejs /app/.next/cache/fetch-cache ./.next/cache/fetch-cache

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
