# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24.1.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production


# Throw-away build stage to reduce size of final image  
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential

# Install node modules
COPY --link package.json yarn.lock .
RUN yarn install --production=false

# Copy environment file and export variables
COPY --link .env.production .env.production

# Copy application code
COPY --link . .

# Build application with environment variables loaded
RUN export $(cat .env.production | grep -v '^#' | xargs) && yarn run build

# Remove development dependencies - not needed, yarn install already prunes


# Final stage for app image
FROM base

EXPOSE 3000

# Copy built application
COPY --from=build /app /app

# Make environment variables available at runtime
RUN if [ -f .env.production ]; then export $(cat .env.production | grep -v '^#' | xargs); fi

# Start the server by default, this can be overwritten at runtime
CMD [ "sh", "-c", "export $(cat .env.production | grep -v '^#' | xargs) 2>/dev/null; yarn run start" ] 