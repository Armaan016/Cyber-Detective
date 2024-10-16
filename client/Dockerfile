FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install react-scripts@latest -g --silent
RUN npm install -g nodemon

EXPOSE 3000

COPY . .

CMD ["nodemon", "--exec", "npm", "start"]