
# FROM node:12.18.3-alpine3.12
# FROM node:14.15.0-alpine3.12
FROM node:20-alpine3.19



RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app
COPY package*.json ./
RUN npm install --force

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 8890

CMD ["yarn", "dev"]