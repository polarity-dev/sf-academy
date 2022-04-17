# Sf Academy: exchange microservice
A simple app to exchange USD & EUR

### Installation
To copy sample credentials
```
cp .env-sample .env .env.dev
```
It is recommended to substitute the line `API_PORT=3000` with `API_PORT=80` in `.env` after copying
### Docker instructions
Start containers
```
NODE_ENV=production npm start
```
Test (run in another shell while containers are running)
```
NODE_ENV=production npm test
```

### Local instructions
Start
```
npm start
```
Test (run in another shell while node is running)
```
npm test
```