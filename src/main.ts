import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

//! Configuración de un SERVICIO HIBRIDO (API REST  + MICROSERVICIO con NAST) 
//Hibrido : porque me permite conectarme con el webhook de Hookdeck  
//MicroServicio : Porque va a interacturar con Orders MS
async function bootstrap() {
  const logger = new Logger('Payments-ms');
  const app = await NestFactory.create(AppModule, {
    rawBody: true, //Esto manda un body como un buffer
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
    
  },
  { inheritAppConfig: true },  //Esto va a ser que mi aplicacion hibrida herede las configuraciones de pipes, validaciones, etc //https://docs.nestjs.com/faq/hybrid-application
);
  await app.startAllMicroservices()
  await app.listen(process.env.PORT);

  logger.log(`Payments Microservice running on port ${envs.port}`);
}
bootstrap();
