// Importamos nodemailer para gestionar el envío de correos
import nodemailer from "nodemailer";
// Importamos las variables de entorno
import { env } from "./env.config.js";
// Importamos el logger para registrar eventos
import { Logger } from "../utils/logger.util.js";

const logger = new Logger("MAIL");

// Creamos el transportador de correos con la configuración de Gmail
export const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: env.mail.secure, // true para puerto 465 (SSL)
  auth: {
    user: env.mail.user, // tu correo Gmail
    pass: env.mail.pass, // la contraseña de aplicación generada
  },
});

// Función que verifica que la conexión con Gmail funcione
// Se llama al iniciar el servidor
export const verifyConnectionEmail = async () => {
  try {
    logger.info("Verificando conexión con el servidor de correos");
    await transporter.verify();
    logger.info("Conexión exitosa con Gmail");
  } catch (error) {
    logger.error(`Error al conectar con Gmail: ${JSON.stringify(error)}`);
    throw error;
  }
};
