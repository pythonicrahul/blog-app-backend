FROM node:20-alpine

WORKDIR /

COPY . .

RUN npm install && npm run build && rm -R -f src

EXPOSE 8000

CMD [ "node", "dist/index.js" ]
