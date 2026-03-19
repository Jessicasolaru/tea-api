// Importamos el servicio de email
import { EmailService } from "../services/email.service.js";

export class EmailController {
  // POST /api/v1/mail
  // Envía un correo electrónico
  // Body esperado: { to, subject, message }
  static async send(req, res, next) {
    try {
      // Extraemos los datos del body de la petición
      const { to, subject, message } = req.body;

      // Validación básica de campos obligatorios
      if (!to || !subject || !message) {
        return res.status(400).json({
          message: "Los campos to, subject y message son obligatorios",
          statusCode: 400,
        });
      }

      const info = await EmailService.send({ to, subject, message });

      // 200 OK — correo enviado con éxito
      res.status(200).json({
        message: "Correo enviado con éxito",
        statusCode: 200,
        data: {
          messageId: info.messageId,
          to: info.accepted,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
