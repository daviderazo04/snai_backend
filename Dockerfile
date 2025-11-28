FROM node:20

WORKDIR /app

# Copiar todo
COPY . .

# Instalar dependencias
RUN npm install

# Compilar NestJS
RUN npm run build

EXPOSE 8080

# Ejecutar
CMD ["npm", "run", "start:prod"]
