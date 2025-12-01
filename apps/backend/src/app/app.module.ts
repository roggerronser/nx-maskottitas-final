import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AdminModule } from '../modules/admin/admin.module';

import { ResultadoModule } from '../modules/resultado/resultado.module';
import { ClienteModule } from '../modules/cliente/cliente.module';
import { PacienteModule } from '../modules/paciente/paciente.module';
import { VacunaModule } from '../modules/vacuna/vacuna.module';
import { PrismaService } from '../prisma/prisma.service';
import { TipoVacunaModule } from '../modules/tipo-vacuna/tipo-vacuna.module';
import { SintomaModule } from '../modules/sintoma/sintoma.module';
import { ConsultaModule } from '../modules/consulta/consulta.module';
import { PdfModule } from '../modules/pdf/pdf.module';
import { ExamenModule } from '../modules/examen/examen.module';
import { MlModule } from '../modules/ml/ml.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    HttpModule,AdminModule,
    ResultadoModule,ClienteModule,
    PacienteModule,VacunaModule,
    TipoVacunaModule, ConsultaModule,
    SintomaModule,SintomaModule,
    ExamenModule,PdfModule,
    ResultadoModule,MlModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'apps', 'backend', 'uploads', 'pdf'),
      serveRoot: '/pdf',
      serveStaticOptions: {
        index: false,
      },
    }),
    PdfModule
  ], 
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}


