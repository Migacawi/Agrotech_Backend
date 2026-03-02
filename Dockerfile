# 1. Usamos una imagen base de Node.js
FROM node:20

# 2. Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto del código
COPY . .

# 6. Generamos el cliente de Prisma (importante para que reconozca los modelos)
RUN npx prisma generate

# 7. Exponemos el puerto en el que corre tu server.js
EXPOSE 3000

# 8. Comando para arrancar la app
CMD ["node", "server.js"]