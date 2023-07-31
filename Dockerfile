FROM node:16-alpine

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install

COPY . .

# Start the bot.
CMD ["yarn", "start"]