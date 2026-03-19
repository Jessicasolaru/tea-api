// Importamos Router de Express para definir las rutas del módulo
import { Router } from "express";
// Importamos el controlador que manejará cada ruta
import { ConductaController } from "../controllers/conducta.controller.js";

const router = Router();

// GET /api/v1/conductas — obtener todas (acepta ?limit=N)
router.get("/", ConductaController.getAll);

// GET /api/v1/conductas/:id — obtener una por ID
router.get("/:id", ConductaController.getById);

// POST /api/v1/conductas — crear nueva conducta
router.post("/", ConductaController.create);

// PUT /api/v1/conductas/:id — actualizar conducta existente
router.put("/:id", ConductaController.update);

// DELETE /api/v1/conductas/:id — eliminar conducta (soft delete)
router.delete("/:id", ConductaController.delete);

export default router;
