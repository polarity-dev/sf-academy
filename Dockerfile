FROM node

WORKDIR /usr/app/

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/bin/wait-for-it.sh
RUN chmod +x /usr/bin/wait-for-it.sh

EXPOSE 3000

CMD [ "sh", "-c", "wait-for-it.sh -t 30 database:3306 && npm i && npm run dev" ]