import express, { json } from 'express';
import router from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(json());

app.use("/api/v1", router);

app.use(errorHandler);

export default app;