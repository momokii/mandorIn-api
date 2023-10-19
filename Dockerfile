ARG JWT_SECRET 
ARG MONGODB_URI 
ARG BUCKET_DEV 
ARG BUCKET_PROD

ARG TYPE 
ARG PROJECT_ID
ARG PRIVATE_KEY_ID
ARG PRIVATE_KEY
ARG CLIENT_EMAIL
ARG CLIENT_ID
ARG AUTH_URI
ARG TOKEN_URI
ARG AUTH_PROVIDER_X509_CERT_URL
ARG CLIENT_X509_CERT_URL

FROM node:lts-alpine

ENV NODE_ENV=production
ENV PORT=8082
ENV JWT_SECRET=$JWT_SECRET
ENV MONGODB_URI=$MONGODB_URI
ENV BUCKET_DEV=$BUCKET_DEV
ENV BUCKET_PROD=$BUCKET_PROD

ENV TYPE=$TYPE
ENV PROJECT_ID=$PROJECT_ID
ENV PRIVATE_KEY_ID=$PRIVATE_KEY_ID
ENV PRIVATE_KEY=$PRIVATE_KEY
ENV CLIENT_EMAIL=$CLIENT_EMAIL
ENV CLIENT_ID=$CLIENT_ID
ENV AUTH_URI=$AUTH_URI
ENV TOKEN_URI=$TOKEN_URI
ENV AUTH_PROVIDER_X509_CERT_URL=$AUTH_PROVIDER_X509_CERT_URL
ENV CLIENT_X509_CERT_URL=$CLIENT_X509_CERT_URL


WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../

COPY . .

EXPOSE 8080

RUN chown -R node /usr/src/app

USER node

CMD ["npm", "start"]

