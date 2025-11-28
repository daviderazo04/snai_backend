FROM node:20

WORKDIR /app


@@ -7,6 +7,8 @@ RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]