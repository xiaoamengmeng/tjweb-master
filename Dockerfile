FROM node:14.9.0 AS build-step

ARG API_SERVER
ARG SITE=default
ARG SITE_NAME
ARG IM_APP_ID

WORKDIR /build
COPY . .

# RUN yarn config set registry http://mirrors.cloud.tencent.com/npm/
RUN yarn && yarn build:${SITE}

RUN sed -i "s#@API_SERVER@#${API_SERVER}#" dist/${SITE}/config/config.js
RUN sed -i "s/@SITE_NAME@/${SITE_NAME}/" dist/${SITE}/config/config.js
RUN sed -i "s/@IM_APP_ID@/${IM_APP_ID}/" dist/${SITE}/config/config.js
RUN cat dist/${SITE}/config/config.js

FROM nginx:1.23-alpine
ARG SITE=default
COPY nginx.conf /etc/nginx/nginx.conf
COPY mp.txt /etc/nginx/mp.txt
RUN echo "/build/dist/${SITE_FOLDER}"
COPY --from=build-step /build/dist/${SITE} /frontend/build
