FROM oven/bun:1

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies using bun
RUN bun install

# Define the build argument so DigitalOcean can inject your App-level env var
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client
RUN bunx turbo run db:generate

# Build the project
RUN bun run build

# Expose your app's port
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]
