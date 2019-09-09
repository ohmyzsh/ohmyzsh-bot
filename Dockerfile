FROM node:alpine

RUN apk add --no-cache \
    zsh \
    git

# Environment settings
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN apk add --no-cache make gcc g++ python2 \
    && npm install --production \
    && apk del --no-cache make gcc g++ python2

# Build app
COPY . .
RUN npm run build

CMD npm run start
