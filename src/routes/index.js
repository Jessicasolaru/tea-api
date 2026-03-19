// Archivo central de rutas: agrupa todas las rutas de la aplicación
import { Router } from "express";
import conductaRoutes from "./conducta.routes.js";
import emailRoutes from "./email.routes.js";

const router = Router();

// Rutas de conductas: /api/v1/conductas
router.use("/conductas", conductaRoutes);

// Rutas de email: /api/v1/mail
router.use("/mail", emailRoutes);

export default router;
