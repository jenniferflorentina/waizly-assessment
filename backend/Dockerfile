# Base image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]