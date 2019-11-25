# Use the alpine node image as base
FROM node:8.11-alpine

# Make port 8080 available for sandbox
EXPOSE 8080
# Make port 80 available for nonprod (fargate requires 80)
EXPOSE 80

# Set the working directory
WORKDIR /metropolis

# Copy our dependency requirements
COPY package.json yarn.lock ./

# Install js dependencies
RUN yarn install

# Copy the code over
COPY . .

# Ensure all node process run in production mode
ENV NODE_ENV=production

# Allow `docker build` to specify METROPOLIS_URL
ARG METROPOLIS_URL
ENV METROPOLIS_URL=${METROPOLIS_URL}
ARG CLS_URL
ENV CLS_URL=${CLS_URL}
ARG CORS_ALLOWED_ORIGINS
ENV CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
ARG AWS_REGION
ENV AWS_REGION=${AWS_REGION}
# Build the app
RUN yarn build
ENTRYPOINT ["/bin/ash", "-c"]
