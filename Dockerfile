# Usa un'immagine Node.js ufficiale come base
FROM node:20-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia `package*.json` per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del progetto nella directory di lavoro
COPY . .

# Espone la porta su cui gira l'app
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["npm", "start"]
