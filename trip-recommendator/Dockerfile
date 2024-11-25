# Usar una imagen base oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install react-router-dom@6

# Copiar todo el resto del código de la aplicación al contenedor
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Exponer el puerto 3000 para que sea accesible desde fuera del contenedor
EXPOSE 3000

# Definir el comando que se ejecutará cuando inicie el contenedor
CMD ["npm", "start"]
