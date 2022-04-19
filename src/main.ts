import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import 'dotenv/config';

(async function start (){
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, { 
        cors: true,
        logger: ['verbose']
    })
    app.setGlobalPrefix('api'); 

    {
        const config = new DocumentBuilder()
            .setTitle('НПО АВТОМАТИВ')
            .setDescription('Документация взаимодействия с APi приложения Системы атоматизации производства НПО Автомотив')
            .setVersion('0.0.1')
            .addTag('NPO')
            .build()
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('/api/docs/', app, document)
    }

    await app.listen(PORT, () => console.log(`
        '${process.env.APPLICATION_TYPE}...' 
        Server running on port: ${PORT}`))
})()