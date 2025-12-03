FROM node:18

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

COPY apps/backend ./apps/backend
COPY apps/backend/prisma ./apps/backend/prisma

RUN npm install --legacy-peer-deps

RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

RUN npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma   # ← AQUÍ

RUN npx nx build backend

WORKDIR /app/dist/apps/backend

EXPOSE 3000

CMD ["node", "main.js"]
