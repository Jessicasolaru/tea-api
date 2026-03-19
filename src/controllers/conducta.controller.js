// Importamos el servicio que contiene toda la lógica de negocio
import { ConductaService } from "../services/conducta.service.js";

// El controlador recibe las peticiones HTTP y las delega al servicio
// No contiene lógica de negocio, solo maneja request y response
export class ConductaController {
  // =========================================
  // GET /api/v1/conductas
  // Obtiene todas las conductas activas
  // Opcionalmente acepta ?limit=10 para limitar resultados
  // =========================================
  static async getAll(req, res, next) {
    try {
      // Leemos el parámetro opcional ?limit de la URL
      const { limit } = req.query;

      const data = await ConductaService.getAll(limit);

      // 200 OK — la petición fue exitosa
      res.status(200).json({
        message: "Conductas obtenidas con éxito",
        statusCode: 200,
        total: data.length,
        data,
      });
    } catch (error) {
      // next(error) envía el error al middleware de manejo de errores
      next(error);
    }
  }

  // =========================================
  // GET /api/v1/conductas/:id
  // Obtiene una conducta específica por su ID
  // =========================================
  static async getById(req, res, next) {
    try {
      // El id viene en los parámetros de la URL (:id)
      const { id } = req.params;

      const data = await ConductaService.getById(id);

      // 200 OK — encontrada con éxito
      res.status(200).json({
        message: "Conducta encontrada con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================
  // POST /api/v1/conductas
  // Crea una nueva conducta
  // =========================================
  static async create(req, res, next) {
    try {
      // Los datos nuevos vienen en el body de la petición
      const data = await ConductaService.create(req.body);

      // 201 Created — recurso creado exitosamente
      res.status(201).json({
        message: "Conducta registrada con éxito",
        statusCode: 201,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================
  // PUT /api/v1/conductas/:id
  // Actualiza una conducta existente
  // =========================================
  static async update(req, res, next) {
    try {
      // El id viene en los parámetros y los datos nuevos en el body
      const { id } = req.params;

      const data = await ConductaService.update(id, req.body);

      // 200 OK — actualización exitosa
      res.status(200).json({
        message: "Conducta actualizada con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================
  // DELETE /api/v1/conductas/:id
  // Elimina lógicamente una conducta (la desactiva)
  // =========================================
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const result = await ConductaService.delete(id);

      // 200 OK — eliminación exitosa
      res.status(200).json({
        message: result.message,
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}
