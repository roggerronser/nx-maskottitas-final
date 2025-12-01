FROM node:18

WORKDIR /app

# Copiar los archivos base del workspace
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copiar backend completo
COPY apps/backend ./apps/backend

# Copiar solo prisma (porque Railway lo usa)
COPY apps/backend/prisma ./apps/backend/prisma

# Instalar dependencias del monorepo
RUN npm install

# Generar Prisma Client
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Build del backend
RUN npx nx build backend

# Entrar al backend compilado
WORKDIR /app/dist/apps/backend

EXPOSE 3000

CMD ["node", "main.js"]
