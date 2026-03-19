// Importamos dotenv para leer las variables del archivo .env
import dotenv from "dotenv";
dotenv.config();

// Exportamos todas las variables de entorno organizadas
export const env = {
  // Puerto donde correrá el servidor
  port: Number(process.env.PORT) || 3000,
  // Entorno de ejecución: development o production
  environment: process.env.ENVIRONMENT || "development",
  // Configuración del servicio de correos
  mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
