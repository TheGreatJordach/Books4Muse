import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';

export function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Book4Muse API')
    .setDescription('API documentation for the Book4Muse application')
    .addServer('http://localhost:3000/', 'Local environment')
    .setVersion('1.0.0')
    .addTag('Authentication', 'Endpoints related to user authentication') // Tag for authentication-related endpoints
    .addTag('User', 'Endpoints for managing user information') // Tag for user-related endpoints
    .addTag('Books', 'Endpoints related to Books in the store') //
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
