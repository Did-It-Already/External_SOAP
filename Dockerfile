FROM node:18.17.1-alpine3.17

WORKDIR /

COPY . .

RUN npm install


EXPOSE 3050

CMD ["node", "prueba.js"]

