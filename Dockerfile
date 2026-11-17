# Leo's Lucha Learning Arena — standalone host image.
# Bun runtime: serves the prebuilt Arena (client + action bundles) with
# the standalone host in server.ts. No build step beyond deps install.
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
COPY sdk ./sdk
RUN bun install --frozen-lockfile --production
COPY . .
ENV NODE_ENV=production
EXPOSE 10000
CMD ["bun", "run", "server.ts"]
