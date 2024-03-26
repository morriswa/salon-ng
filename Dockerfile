#stage 1
FROM --platform=x86-64 node:20 as node
WORKDIR /app
COPY ./src /app/src/
COPY ./node_modules /app/node_modules/
COPY *.json /app/
COPY README.md /app/
RUN npm run build:prod
#stage 2
FROM --platform=x86-64 nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/salon-ng /usr/share/nginx/html
