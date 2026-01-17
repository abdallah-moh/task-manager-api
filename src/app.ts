import express, { json } from 'express';
import { usersRoute } from './routes/index.js';

const app = express();

app.use(json());

app.use("/api/v1/users", usersRoute);

export default app;