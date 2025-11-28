FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080
CMD ["node", "dist/src/main.js"]
