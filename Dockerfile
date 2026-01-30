# Base stage
FROM node:24-alpine AS base
WORKDIR /home/app
COPY ./package*.json .
RUN npm ci

# Development stage
FROM node:24-alpine AS development
WORKDIR /home/app
COPY --from=base /home/app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]

FROM node:24-alpine AS build
WORKDIR /home/app
COPY --from=base /home/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine as production
WORKDIR /home/app

ENV NODE_ENV=production
COPY --from=build /home/app/package*.json .
RUN npm ci --omit-dev

COPY --from=build /home/app/dist ./dist

CMD ["node", "./dist/server.js"]



