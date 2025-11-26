# Build Stage 1
# This build created a docker image
#
FROM node:20.12.2-alpine AS builder
WORKDIR /app
COPY ./ ./
RUN npm install --legacy-peer-deps
RUN npm run build

# Build Stage 2
# This build takes the production build from first build
#
FROM node:20.12.2-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install --only=production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
EXPOSE 5050
CMD ["npm","run","start:prod"]
