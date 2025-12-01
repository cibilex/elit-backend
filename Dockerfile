FROM node:20.12.2-alpine AS builder
WORKDIR /app
COPY ./ ./
RUN npm install --legacy-peer-deps
RUN npm run build

FROM node:20.12.2-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install --only=production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
EXPOSE 7000
CMD ["npm","run","start:prod"]
