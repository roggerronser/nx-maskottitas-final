-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id_paciente" SERIAL NOT NULL,
    "paciente" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id_paciente")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id_consulta" SERIAL NOT NULL,
    "edad" INTEGER NOT NULL,
    "anamnesis" TEXT NOT NULL,
    "caracteristica" TEXT NOT NULL,
    "temperatura" DECIMAL(65,30) NOT NULL,
    "fc" INTEGER NOT NULL,
    "fr" INTEGER NOT NULL,
    "hidratacion" TEXT NOT NULL,
    "mucosas" TEXT NOT NULL,
    "tiempo_relleno_capilar" TEXT NOT NULL,
    "spo2" DECIMAL(65,30) NOT NULL,
    "glucosa" DECIMAL(65,30) NOT NULL,
    "presion_arterial" TEXT NOT NULL,
    "otros" TEXT NOT NULL,
    "fecha_consulta" TIMESTAMP(3) NOT NULL,
    "estado_consulta" INTEGER NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "id_sintoma" INTEGER NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id_consulta")
);

-- CreateTable
CREATE TABLE "Sintoma" (
    "id_sintoma" SERIAL NOT NULL,
    "sintoma" TEXT NOT NULL,

    CONSTRAINT "Sintoma_pkey" PRIMARY KEY ("id_sintoma")
);

-- CreateTable
CREATE TABLE "Examen" (
    "id_examen" SERIAL NOT NULL,
    "tipo_examen" TEXT NOT NULL,
    "diagnt_presuntivo" TEXT NOT NULL,
    "id_consulta" INTEGER NOT NULL,

    CONSTRAINT "Examen_pkey" PRIMARY KEY ("id_examen")
);

-- CreateTable
CREATE TABLE "Pdf" (
    "id_pdf" SERIAL NOT NULL,
    "pdf" TEXT NOT NULL,
    "id_examen" INTEGER NOT NULL,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("id_pdf")
);

-- CreateTable
CREATE TABLE "Resultado" (
    "id_resultado" SERIAL NOT NULL,
    "diagnt_definitivo" TEXT NOT NULL,
    "tratamiento" TEXT NOT NULL,
    "prox_cita" TIMESTAMP(3) NOT NULL,
    "observaciones" TEXT NOT NULL,
    "id_examen" INTEGER NOT NULL,

    CONSTRAINT "Resultado_pkey" PRIMARY KEY ("id_resultado")
);

-- CreateTable
CREATE TABLE "TipoVacuna" (
    "id_tipo_vacuna" SERIAL NOT NULL,
    "tipo_vacuna" TEXT NOT NULL,

    CONSTRAINT "TipoVacuna_pkey" PRIMARY KEY ("id_tipo_vacuna")
);

-- CreateTable
CREATE TABLE "Vacuna" (
    "id_vacuna" SERIAL NOT NULL,
    "aplicacion_vacuna" TEXT NOT NULL,
    "estado_vacuna" INTEGER NOT NULL,
    "temperatura_vacuna" TEXT NOT NULL,
    "fc_vacuna" TEXT NOT NULL,
    "fr_vacuna" TEXT NOT NULL,
    "mucosa_vacuna" TEXT NOT NULL,
    "fecha_vacuna" TIMESTAMP(3) NOT NULL,
    "proxima_vacuna" TIMESTAMP(3) NOT NULL,
    "id_tipo_vacuna" INTEGER NOT NULL,
    "id_paciente" INTEGER NOT NULL,

    CONSTRAINT "Vacuna_pkey" PRIMARY KEY ("id_vacuna")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_id_sintoma_fkey" FOREIGN KEY ("id_sintoma") REFERENCES "Sintoma"("id_sintoma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_id_consulta_fkey" FOREIGN KEY ("id_consulta") REFERENCES "Consulta"("id_consulta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_id_examen_fkey" FOREIGN KEY ("id_examen") REFERENCES "Examen"("id_examen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_id_examen_fkey" FOREIGN KEY ("id_examen") REFERENCES "Examen"("id_examen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacuna" ADD CONSTRAINT "Vacuna_id_tipo_vacuna_fkey" FOREIGN KEY ("id_tipo_vacuna") REFERENCES "TipoVacuna"("id_tipo_vacuna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacuna" ADD CONSTRAINT "Vacuna_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;
