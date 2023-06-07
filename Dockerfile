FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Libgl required to optimize images
RUN apt-get update && apt-get install -y nano
RUN npm install nuxt -g

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

EXPOSE 3000

#ENTRYPOINT ["tail"]
#CMD ["-f","/dev/null"]
CMD ["npm", "run",  "dev"]
