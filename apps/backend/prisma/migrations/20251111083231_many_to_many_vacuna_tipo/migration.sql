/*
  Warnings:

  - You are about to drop the column `id_sintoma` on the `Consulta` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_id_sintoma_fkey";

-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "id_sintoma";

-- CreateTable
CREATE TABLE "_ConsultaSintomas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConsultaSintomas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConsultaSintomas_B_index" ON "_ConsultaSintomas"("B");

-- AddForeignKey
ALTER TABLE "_ConsultaSintomas" ADD CONSTRAINT "_ConsultaSintomas_A_fkey" FOREIGN KEY ("A") REFERENCES "Consulta"("id_consulta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsultaSintomas" ADD CONSTRAINT "_ConsultaSintomas_B_fkey" FOREIGN KEY ("B") REFERENCES "Sintoma"("id_sintoma") ON DELETE CASCADE ON UPDATE CASCADE;
