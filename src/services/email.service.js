// Importamos el transportador de nodemailer ya configurado
import { transporter } from "../config/mail.config.js";
// Importamos las variables de entorno para obtener el correo remitente
import { env } from "../config/env.config.js";
// Importamos el logger para registrar eventos
import { Logger } from "../utils/logger.util.js";
// Importamos el error personalizado para emails
import { InternalServerError } from "../utils/errors.util.js";

export class EmailService {
  // Logger con contexto específico para este servicio
  static logger = new Logger("EMAIL_SERVICE");

  // Correo remitente tomado de las variables de entorno
  static #user = env.mail.user;

  // ENVIAR un correo electrónico
  // Recibe: destinatarios (array), asunto y mensaje
  static async send({ to, subject, message }) {
    try {
      this.logger.info("Preparando configuración del correo");

      // Configuración completa del correo a enviar
      const mailOptions = {
        from: this.#user,
        // Si to es un arreglo, lo unimos con comas
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        // Versión texto plano del mensaje
        text: message,
        // Versión HTML del mensaje usando nuestra plantilla
        html: this.#htmlTemplate(message),
      };

      this.logger.debug(
        `Enviando a: ${mailOptions.to} | Asunto: ${mailOptions.subject}`,
      );

      // Enviamos el correo con el transportador
      const info = await transporter.sendMail(mailOptions);

      this.logger.info(`Correo enviado con éxito | ID: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Error al enviar el correo: ${error.message}`);
      throw new InternalServerError("Error al enviar el correo", error.message);
    }
  }

  // PLANTILLA HTML del correo
  // Método privado que genera el HTML del cuerpo del correo

  static #htmlTemplate(message) {
    return `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 8px;
                border: 1px solid #ddd;
            ">
                <h2 style="color: #4a90d9;">
                    Sistema de Apoyo TEA 🦖 
                </h2>
                <p style="color: #333; font-size: 16px;">
                    ${message}
                </p>
                <hr style="border: none; border-top: 1px solid #ddd;" />
                <small style="color: #999;">
                    Este correo fue enviado automáticamente por la API TEA. 💙
                </small>
            </div>
        `;
  }
}
