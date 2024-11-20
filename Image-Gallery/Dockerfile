# Usa una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY ./src /app/src
COPY ./server.js /app/
COPY .env /app

# Instala las dependencias de Node.js
COPY package.json /app/
RUN npm install express dotenv node-fetch

# Expone el puerto que se va a utilizar
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
