// Importamos el módulo de sistema de archivos de Node.js (versión con promesas)
import fs from "fs/promises";
// Importamos path para manejar rutas de archivos de forma segura
import path from "path";
// Importamos nuestro error personalizado para errores internos
import { InternalServerError } from "./errors.util.js";

// Clase utilitaria estática para leer y escribir archivos JSON
// Todos sus métodos son estáticos, no necesita instanciarse
export class FilesUtils {
  // Lee un archivo JSON y retorna su contenido como objeto JavaScript
  static async readFile(pathFile) {
    try {
      const data = await fs.readFile(pathFile, "utf-8");
      // Convertimos el texto JSON a objeto JavaScript
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, retornamos false en lugar de lanzar error
      // Esto permite que el servicio decida qué hacer cuando no hay datos aún
      if (error.code === "ENOENT") return false;
      console.log("[ERROR] No se pudo leer el archivo:", error.message);
      throw new InternalServerError(
        `Error crítico al leer ${pathFile}`,
        error.message,
      );
    }
  }

  // Escribe un objeto JavaScript en un archivo JSON
  static async writeFile(pathFile, data) {
    try {
      // Convertimos el objeto a texto JSON con formato legible (2 espacios)
      await fs.writeFile(pathFile, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.log("[ERROR] No se pudo escribir el archivo:", error.message);
      throw new InternalServerError(
        "Error al escribir el archivo",
        error.message,
      );
    }
  }

  // Se asegura de que la carpeta donde va el archivo exista
  // Si no existe, la crea automáticamente (recursive:true crea carpetas anidadas)
  static async pathEnsure(pathFile) {
    try {
      // dirname extrae solo la carpeta del path completo
      const folder = path.dirname(pathFile);
      await fs.mkdir(folder, { recursive: true });
    } catch (error) {
      console.log("[ERROR] Error al asegurar la ruta:", error.message);
      throw new InternalServerError("Error al asegurar la ruta", error.message);
    }
  }
}
