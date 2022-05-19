FROM node:16

WORKDIR /app

COPY package*.json ./
COPY gulpfile.js ./

RUN npm install

COPY . .

CMD ["node", "src/index.js"]

EXPOSE 3000