# Usa un'immagine di base con il supporto per Node.js
FROM node:latest

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia il package.json e il package-lock.json (se esiste)
COPY package*.json ./

# Installa le dipendenze
RUN npm install
RUN npm install -g http-server

# Copia il resto dell'app
COPY . .

# Espone la porta 3000
EXPOSE 3000

CMD ["http-server", "-p", "3000", "./src"]