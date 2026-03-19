// Importamos Router de Express
import { Router } from "express";
// Importamos el controlador de email
import { EmailController } from "../controllers/email.controller.js";

const router = Router();

// POST /api/v1/mail — enviar un correo
router.post("/", EmailController.send);

export default router;
