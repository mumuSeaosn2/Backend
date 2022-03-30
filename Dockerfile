From node:alpine
 
WORKDIR /usr/app
COPY ./ /usr/app
 
COPY pakage*.json ./
RUN yarn install

RUN yarn global add nodemon
#개발시
CMD ["nodemon","-L","server.js"]

#실사용시
#CMD ["yarn", "start"]