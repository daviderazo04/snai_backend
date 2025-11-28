FROM node:20 AS builder
WORKDIR /app

# Instala dependencias (incluye dev para compilar Nest)
COPY package*.json ./
RUN npm ci

# Copia el código y construye
COPY . .
RUN npm run build

# Imagen final: solo prod deps + dist
FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/src/main.js"]
