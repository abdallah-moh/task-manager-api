import express, { json } from 'express';
import { tasksRoute, usersRoute } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(json());

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/tasks", tasksRoute);

app.use(errorHandler);

export default app;