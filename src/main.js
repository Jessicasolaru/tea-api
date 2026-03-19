// Importamos Express para crear el servidor
import express from "express";
// Importamos la configuración de variables de entorno
import { env } from "./config/env.config.js";
// Importamos el enrutador central
import appRouter from "./routes/index.js";
// Importamos el middleware de manejo de errores
import { errorHandler } from "./middlewares/error.middleware.js";
// Importamos el logger para registrar eventos del servidor
import { Logger } from "./utils/logger.util.js";
// Importamos la función que verifica la conexión con Gmail
import { verifyConnectionEmail } from "./config/mail.config.js";

const app = express();
const logger = new Logger("SERVER");

// MIDDLEWARES GLOBALES
// Permite que Express entienda el body en formato JSON
app.use(express.json());

// RUTAS
// Todas las rutas de la API estarán bajo /api/v1
app.use("/api/v1", appRouter);

// MIDDLEWARE DE ERRORES
// Debe ir siempre al final, después de las rutas
app.use(errorHandler);

// INICIAR EL SERVIDOR
app.listen(env.port, async () => {
  // Verificamos la conexión con Gmail al iniciar
  try {
    await verifyConnectionEmail();
    logger.info("Transportador de correos listo");
  } catch (error) {
    logger.error(`Problema con el transportador de correos: ${error.message}`);
  }

  logger.info(`Servidor corriendo en modo ${env.environment}`);
  logger.info(`Escuchando en http://localhost:${env.port}`);
  logger.info(`Ruta base: http://localhost:${env.port}/api/v1/conductas`);
});
