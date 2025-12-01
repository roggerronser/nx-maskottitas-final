FROM node:18

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copiar backend completo
COPY apps/backend ./apps/backend

# Copiar prisma (ahora sí, Railway lo encontrará)
COPY apps/backend/prisma ./apps/backend/prisma

RUN npm install --legacy-peer-deps

RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

RUN npx nx build backend

WORKDIR /app/dist/apps/backend

EXPOSE 3000

CMD ["node", "main.js"]
