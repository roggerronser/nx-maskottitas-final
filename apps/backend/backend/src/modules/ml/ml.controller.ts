import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MlService } from './ml.service';

@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  // POST /ml/predict
  @Post('predict')
  async predict(@Body('id_sintoma') id_sintoma: number[]) {
    if (!Array.isArray(id_sintoma) || id_sintoma.length === 0) {
      throw new BadRequestException('Debe enviar un array "id_sintoma" con ids de síntomas.');
    }

    const ids = id_sintoma.map((x) => Number(x)).filter((x) => !isNaN(x));

    const result = this.mlService.predict(ids);
    return result;
  }

  // POST /ml/retrain  (por si quieres forzar reentrenamiento manual)
  @Post('retrain')
  async retrain() {
    await this.mlService.retrain();
    return { status: 'Modelo reentrenado correctamente.' };
  }
}
