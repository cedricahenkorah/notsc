import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
{% if swagger %}import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
{% endif %}import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

{% if swagger %}const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '{{ projectName }} API',
      version: '1.0.0',
      description: 'A Node.js TypeScript API',
    },
    servers: [
      {
        url: 'http://localhost:${process.env.PORT || 3000}',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
{% endif %}

app.use('/api', routes);

app.use(errorHandler);

export default app;
