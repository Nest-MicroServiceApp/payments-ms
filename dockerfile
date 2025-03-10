FROM node:21-alpine3.20


WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

# Copia wait-for-it.sh al contenedor y establece permisos de ejecución
# COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
# RUN chmod +x /usr/src/app/wait-for-it.sh


EXPOSE 3003

# CMD ["./wait-for-it.sh", "orders-db:5432", "--", "npm", "run", "start:dev"]
