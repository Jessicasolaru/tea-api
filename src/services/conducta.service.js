// Importamos el modelo Conducta para crear y validar instancias
import { Conducta } from "../models/Conducta.js";
// Importamos los errores personalizados que necesitamos
import { NotFoundError, InternalServerError } from "../utils/errors.util.js";
// Importamos la utilidad para leer y escribir archivos JSON
import { FilesUtils } from "../utils/file.util.js";
// Importamos el logger para registrar lo que ocurre en el servicio
import { Logger } from "../utils/logger.util.js";

// Clase de servicio estática: contiene toda la lógica de negocio
// No necesita instanciarse, todos sus métodos son estáticos
export class ConductaService {
  // Ruta donde se guardará el archivo JSON con los datos
  static #pathFile = "./src/data/conductas.json";

  // Logger con contexto específico para este servicio
  static logger = new Logger("CONDUCTA_SERVICE");

  // =========================================
  // CREAR una nueva conducta
  // =========================================
  static async create(data) {
    try {
      this.logger.info("Iniciando creación de conducta");

      // Nos aseguramos de que la carpeta exista antes de escribir
      await FilesUtils.pathEnsure(this.#pathFile);

      // Leemos las conductas actuales del archivo
      const conductas = await FilesUtils.readFile(this.#pathFile);

      // Creamos una nueva instancia validada del modelo
      this.logger.debug("Creando nueva instancia de Conducta");
      const nuevaConducTA = Conducta.create(data);

      // Si el archivo no existía o estaba vacío, creamos la estructura inicial
      if (!conductas) {
        this.logger.warn("No había registros previos, creando archivo nuevo");
        await FilesUtils.writeFile(this.#pathFile, [nuevaConducTA.toJSON()]);
        return nuevaConducTA.toJSON();
      }

      // Agregamos la nueva conducta al arreglo existente
      conductas.push(nuevaConducTA.toJSON());

      // Guardamos el arreglo actualizado en el archivo
      await FilesUtils.writeFile(this.#pathFile, conductas);
      this.logger.info("Conducta creada con éxito");

      return nuevaConducTA.toJSON();
    } catch (error) {
      this.logger.error(`Error al crear conducta: ${error.message}`);
      // Re-lanzamos el error para que lo maneje el middleware
      throw error;
    }
  }

  // =========================================
  // OBTENER TODAS las conductas activas
  // Opcionalmente limitadas a un número (ej: las primeras 10)
  // =========================================
  static async getAll(limit) {
    try {
      this.logger.info("Leyendo todas las conductas activas");

      const data = await FilesUtils.readFile(this.#pathFile);

      // Si no hay datos, retornamos arreglo vacío
      if (!data) return [];

      // Filtramos solo las conductas activas
      let conductas = data.filter((c) => c.isActive);

      // Si viene un límite válido, recortamos el arreglo
      if (limit && !isNaN(Number(limit))) {
        conductas = conductas.slice(0, Number(limit));
        this.logger.debug(`Aplicando límite de ${limit} registros`);
      }

      // Convertimos cada objeto plano en una instancia validada
      return conductas.map((c) => Conducta.create(c).toJSON());
    } catch (error) {
      this.logger.error(`Error al leer conductas: ${error.message}`);
      throw error;
    }
  }

  // =========================================
  // OBTENER UNA conducta por su ID
  // =========================================
  static async getById(id) {
    try {
      this.logger.info(`Buscando conducta con id: ${id}`);

      const data = await FilesUtils.readFile(this.#pathFile);

      if (!data) throw new NotFoundError("No hay registros disponibles");

      // Buscamos la conducta que coincida con el id y esté activa
      const encontrada = data.find((c) => c.id === id && c.isActive);

      // Si no existe, lanzamos error 404
      if (!encontrada)
        throw new NotFoundError(
          "Conducta no encontrada",
          `No existe una conducta activa con el id: ${id}`,
        );

      this.logger.info("Conducta encontrada con éxito");
      return Conducta.create(encontrada).toJSON();
    } catch (error) {
      this.logger.error(`Error al buscar conducta: ${error.message}`);
      throw error;
    }
  }

  // =========================================
  // ACTUALIZAR una conducta existente
  // =========================================
  static async update(id, newData) {
    try {
      this.logger.info(`Actualizando conducta con id: ${id}`);

      const conductas = await FilesUtils.readFile(this.#pathFile);

      if (!conductas) throw new NotFoundError("No hay registros disponibles");

      // Buscamos el índice de la conducta a actualizar
      const index = conductas.findIndex((c) => c.id === id && c.isActive);

      // Si no se encuentra, error 404
      if (index === -1)
        throw new NotFoundError(
          "Conducta no encontrada para actualizar",
          `No existe una conducta activa con el id: ${id}`,
        );

      // Creamos una nueva instancia con los datos nuevos pero conservando el mismo id
      const conductaActualizada = Conducta.create({ ...newData, id });

      // Reemplazamos en el arreglo
      conductas[index] = conductaActualizada.toJSON();

      // Guardamos el arreglo actualizado
      await FilesUtils.writeFile(this.#pathFile, conductas);
      this.logger.info("Conducta actualizada con éxito");

      return conductaActualizada.toJSON();
    } catch (error) {
      this.logger.error(`Error al actualizar conducta: ${error.message}`);
      throw error;
    }
  }

  // =========================================
  // ELIMINAR una conducta (borrado lógico)
  // No borra el registro, solo lo desactiva (isActive = false)
  // =========================================
  static async delete(id) {
    try {
      this.logger.info(`Eliminando (soft delete) conducta con id: ${id}`);

      const conductas = await FilesUtils.readFile(this.#pathFile);

      if (!conductas) throw new NotFoundError("No hay registros disponibles");

      const index = conductas.findIndex((c) => c.id === id && c.isActive);

      if (index === -1)
        throw new NotFoundError(
          "Conducta no encontrada para eliminar",
          `No existe una conducta activa con el id: ${id}`,
        );

      // Creamos la instancia y la desactivamos
      const instancia = Conducta.create(conductas[index]);
      instancia.desactivar();

      // Guardamos el cambio en el arreglo
      conductas[index] = instancia.toJSON();
      await FilesUtils.writeFile(this.#pathFile, conductas);

      this.logger.info("Conducta desactivada con éxito");

      // Retornamos un mensaje informativo
      return { message: `Conducta con id ${id} eliminada correctamente` };
    } catch (error) {
      this.logger.error(`Error al eliminar conducta: ${error.message}`);
      throw error;
    }
  }
}
