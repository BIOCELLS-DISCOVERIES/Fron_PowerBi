# Usar imagen Node oficial
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y lockfile
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Build de Next.js
RUN npm run build

# Puerto de producción
EXPOSE 3000

# Iniciar la app
CMD ["npm", "start"]
