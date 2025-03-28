import express from "express";
import bodyParser from "body-parser";
import clientsRoutes from './routes/clientsRoutes.js';
import swaggerSpec from "./api-docs.js";
import swaggerUI from "swagger-ui-express";

const app = express();

app.use(bodyParser.json());

app.use('/api/clients', clientsRoutes);
app.use('/api-docs', swaggerUI.serve,
    swaggerUI.setup(swaggerSpec));

//onectarRabbitMQ();   
    
export default app;