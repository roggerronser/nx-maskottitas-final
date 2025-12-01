FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de configuración global del monorepo
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copiar solo la parte del backend (reducción de peso)
COPY apps/backend ./apps/backend

# Copiar prisma (Railway lo necesita para generar cliente)
COPY apps/backend/prisma ./apps/backend/prisma

# Instalar dependencias del monorepo
RUN npm install --legacy-peer-deps

# Generar cliente de Prisma según la ruta del backend
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Construir el backend usando Nx
RUN npx nx build backend

# Entrar a la carpeta compilada del backend
WORKDIR /app/dist/apps/backend

# Exponer el puerto del backend
EXPOSE 3000

# Comando final para iniciar NestJS
CMD ["node", "main.js"]
