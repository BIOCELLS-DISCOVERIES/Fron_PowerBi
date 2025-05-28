# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de package.json y package-lock.json al contenedor
COPY package.json package-lock.json ./

# Instala las dependencias de Node.js, ignorando conflictos de dependencias
RUN npm install --legacy-peer-deps

# Copia todo el contenido del proyecto al contenedor
COPY . .

# Expone el puerto 3000 para la aplicación Next.js
EXPOSE 3000

# Comando para iniciar la aplicación Next.js
CMD ["npm", "run", "dev"]
