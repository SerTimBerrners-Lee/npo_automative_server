FROM node:10

WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm   
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "serve"] 