FROM node:18-alpine as base
WORKDIR /src
COPY package*.json ./
EXPOSE 8083

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY --chown=node:node . ./
USER node
CMD ["node", "server.js"]