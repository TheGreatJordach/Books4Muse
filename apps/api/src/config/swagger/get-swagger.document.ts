import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';

export function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Book4Muse API')
    .setDescription('API documentation for the Book4Muse application')
    .setVersion('1.0.0')
    .addBearerAuth() // Add JWT Auth support
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Only expose Swagger in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // Allow auth tokens to persist across requests
      },
    });
  }
}
