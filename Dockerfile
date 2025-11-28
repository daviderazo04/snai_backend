FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build la app en la imagen para que dist exista en runtime
RUN npm run build

EXPOSE 8080
CMD ["node", "dist/src/main.js"]
