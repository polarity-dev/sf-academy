# syntax=docker/dockerfile:1
FROM node:latest
WORKDIR /app

ARG PACKAGE_NAME="."
ARG PACKAGE_DIR="./packages/${PACKAGE_NAME}"
ARG BUILD_FOLDER="dist"

COPY ${PACKAGE_DIR}/${BUILD_FOLDER} /app/dist
COPY ${PACKAGE_DIR}/package*.json .

ENV PORT=9999
EXPOSE ${PORT}

# Install node dependencies
RUN yarn install --prod

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]