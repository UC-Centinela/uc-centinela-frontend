FROM node:lts-alpine

WORKDIR /usr/src/app

# Set environment to development (same as docker-compose)
ENV NODE_ENV=development

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]