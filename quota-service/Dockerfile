FROM node
WORKDIR /home/node/app

COPY src /home/node/app/src
COPY package.json /home/node/app

EXPOSE 3000

RUN npm install
CMD [ "npm", "start" ]