import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';
import { version } from '../../../package.json';
import swaggerUI from 'swagger-ui-express';
import { join } from 'path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Fashion',
      version: version,
      description: 'E-Fashion API Documentation',
      license: { name: 'Apache License', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          schema: 'bearer',
          bearerFromat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    join(__dirname, '..', 'api') + '/**/*.router.{ts,js}',
    join(__dirname, '..', 'api') + '/**/*.valid.{ts,js}',
    join(__dirname, '..', 'admin_api') + '/router.{ts,js}',
    join(__dirname, '..', '..', '..', '/docs') + '/*.yaml',
    join(__dirname, '..', '..', '..', '..', '/docs') + '/*.yaml',
  ],
};

const swaggerDocs = swaggerJSDoc(options);

export function createDocs(app: Express) {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
}
