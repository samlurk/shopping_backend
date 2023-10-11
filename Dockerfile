###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:latest as development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./

RUN yarn install 

COPY --chown=node:node . ./

RUN chown node:node /usr/src/app

USER node

###################
# BUILD FOR PRODUCTION
###################


FROM node:latest as build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn run build

RUN rm -rf ./node_modules && yarn install --production=true && yarn cache clean

USER node

###################
# PRODUCTION
###################

FROM node:latest as production

COPY --chown=node:node  --from=build /usr/src/app/node_modules ./node_modules

COPY --chown=node:node .env ./

COPY --chown=node:node  --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/app.js"]
