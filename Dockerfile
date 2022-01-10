FROM node:12

WORKDIR /app/

COPY package.json .

COPY prisma ./prisma/

RUN npm install

COPY . .