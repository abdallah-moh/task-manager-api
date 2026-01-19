import express, { json } from 'express';
import { usersRoute } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(json());

app.use("/api/v1/users", usersRoute);

app.use(errorHandler);

export default app;