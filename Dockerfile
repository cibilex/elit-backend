# Build Stage 1
# This build created a docker image
#
FROM node:20.12.2-alpine AS build-stage
WORKDIR /usr/src/app
COPY ./ /usr/src/app
RUN npm install --legacy-peer-deps
RUN npm run build

# Build Stage 2
# This build takes the production build from first build
#
FROM  node:20.12.2-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY --from=build-stage /usr/src/app/dist ./dist
EXPOSE 6000
CMD ["npm","run","start:prod"]
