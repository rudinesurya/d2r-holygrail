FROM node:alpine As development

WORKDIR /usr/src/app

# Copy the root package.json and yarn.lock to install workspace dependencies
COPY ../../package.json ../../yarn.lock ./

# Install Yarn globally
RUN npm install -g yarn

# Install all dependencies for the workspace
RUN yarn install --frozen-lockfile

# Copy only the necessary files for the auth service
COPY apps/auth ./apps/auth
COPY libs ./libs

# Build the auth service
RUN yarn workspace @cain-d2r-holygrail/auth build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy the root package.json and yarn.lock for production dependencies
COPY ../../package.json ../../yarn.lock ./

# Install production dependencies
RUN npm install -g yarn
RUN yarn install --frozen-lockfile --production

# Copy the built files from the development stage
COPY --from=development /usr/src/app/apps/auth/dist ./dist

# Set the default command
CMD ["node", "dist/main"]