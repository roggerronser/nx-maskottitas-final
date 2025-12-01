-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_id_paciente_fkey";

-- DropForeignKey
ALTER TABLE "Examen" DROP CONSTRAINT "Examen_id_consulta_fkey";

-- DropForeignKey
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_id_cliente_fkey";

-- DropForeignKey
ALTER TABLE "Pdf" DROP CONSTRAINT "Pdf_id_examen_fkey";

-- DropForeignKey
ALTER TABLE "Resultado" DROP CONSTRAINT "Resultado_id_examen_fkey";

-- DropForeignKey
ALTER TABLE "Vacuna" DROP CONSTRAINT "Vacuna_id_paciente_fkey";

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_id_consulta_fkey" FOREIGN KEY ("id_consulta") REFERENCES "Consulta"("id_consulta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_id_examen_fkey" FOREIGN KEY ("id_examen") REFERENCES "Examen"("id_examen") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_id_examen_fkey" FOREIGN KEY ("id_examen") REFERENCES "Examen"("id_examen") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacuna" ADD CONSTRAINT "Vacuna_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;
