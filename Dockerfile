FROM node:18

# Carpeta de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

RUN npm install

# Copiar todo el proyecto
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando por defecto: prisma generate + iniciar server
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/server.js"]