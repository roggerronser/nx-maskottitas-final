/*
  Warnings:

  - You are about to drop the column `id_tipo_vacuna` on the `Vacuna` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vacuna" DROP CONSTRAINT "Vacuna_id_tipo_vacuna_fkey";

-- AlterTable
ALTER TABLE "Vacuna" DROP COLUMN "id_tipo_vacuna";

-- CreateTable
CREATE TABLE "_VacunaTipos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VacunaTipos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_VacunaTipos_B_index" ON "_VacunaTipos"("B");

-- AddForeignKey
ALTER TABLE "_VacunaTipos" ADD CONSTRAINT "_VacunaTipos_A_fkey" FOREIGN KEY ("A") REFERENCES "TipoVacuna"("id_tipo_vacuna") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VacunaTipos" ADD CONSTRAINT "_VacunaTipos_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacuna"("id_vacuna") ON DELETE CASCADE ON UPDATE CASCADE;
