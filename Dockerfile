FROM --platform=x86-64 nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/salon-ng /usr/share/nginx/html
