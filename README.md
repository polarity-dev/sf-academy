# Sf Academy: exchange microservice
A simple app to exchange USD & EUR

### Installation
To copy sample credentials (substitute the line `API_PORT=80` with `API_PORT=3000` in `.env.dev` to avoid permission errors)
```
cp .env-sample .env .env.dev
```

To grant permission for the build and start scripts
```
chmod +x npm_scripts/*
```

### Docker instructions
Start containers
```
NODE_ENV=production npm start
```
Test (run in another shell while containers are running)
```
NODE_ENV=production npm test
```
To build services separately without running docker
```
sh npm_scripts/build-<service-name>.sh
```
The output will be on `<service-name>/build`

### Local instructions
Start
```
npm start
```
Test (run in another shell while node is running)
```
npm test
```

### Notes
With docker-compose, the nginx container `client` will serve the static webapp at `/` and forward calls starting with `/api` to the api.
Therefore the api is both reachable from `${API_HOST}:${API_PORT}` and `${CLIENT_HOST}:${CLIENT_PORT}/api`
pp
For local development (without containers), api and frontend will be reachable from separate ports, respectively `${API_PORT}` and `${CLIENT_PORT}`