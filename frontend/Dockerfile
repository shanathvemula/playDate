FROM node:12.16.0-stretch

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
#COPY . /usr/src/app/
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
EXPOSE 3000
#CMD [ "node", "server.js" ]
#CMD [ "npm", "run", "start" ]
RUN npm run dev
# ENTRYPOINT [ "npm", "run", "start"]
#CMD [ "npm", "run", "prodserver" ]