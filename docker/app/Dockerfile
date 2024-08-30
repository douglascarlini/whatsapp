FROM node:20-alpine
WORKDIR /usr/src/app
COPY app/package*.json ./
RUN npm install
COPY app .
CMD ["npm", "run", "start"]