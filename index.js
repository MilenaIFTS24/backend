import express from "express";
import cors from "cors"; // Para navegador. No es necesario si se utiliza Postman.
import 'dotenv/config';

import teasProductsRouter from "./src/routes/teasProducts.router.js"; // teasProductsRouter (nombre personalizado) por uso de default
import craftsProductsRouter from "./src/routes/craftsProducts.router.js";
import offersRouter from "./src/routes/offers.router.js";
import eventsRouter from "./src/routes/events.router.js";
import reservationsRouter from "./src/routes/reservations.router.js";
import usersRouter from "./src/routes/users.router.js";

import authRouter from "./src/routes/auth.router.js";
import { notFoundHandler } from "./src/middlewares/error.middleware.js";
import { requestLogger } from "./src/middlewares/logger.middleware.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(requestLogger); //Middleware de log con información de la solicitud

app.use('/api/auth', authRouter);
app.use("/api/products/teas", teasProductsRouter); // Prefijo /api, buenas prácticas para versionamiento.
app.use("/api/products/crafts", craftsProductsRouter);
app.use("/api/offers", offersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/users", usersRouter);

app.use(notFoundHandler); //Middleware para manejar rutas no encontradas

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
