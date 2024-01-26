# Usa un'immagine di base con il supporto per Node.js
FROM node:latest

# Imposta la directory di lavoro
WORKDIR /usr/src/node

# Copia il package.json e il package-lock.json (se esiste)
COPY package*.json ./

# Copia il resto dell'app
COPY . .

# Installa le dipendenze
RUN npm install
RUN npx tsc

# Espone la porta 3001
EXPOSE 3001

# Avvia il server
CMD ["node", "./dist/server.js"]
