FROM node:20
LABEL maintainer="roberto@example.com"
LABEL description="Aplicacion ONPE con Puppeteer y Excel"
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","start"]