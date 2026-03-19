// Importamos la clase de error de validación personalizada
import { ValidationError } from "../utils/errors.util.js";

// Clase que representa el modelo de una Conducta registrada
// Usa campos privados (#) para proteger los datos internos
export class Conducta {
  #id;
  #nombre;
  #fecha;
  #intensidad;
  #gatillante;
  #frecuencia;
  #isActive;

  // Constructor: recibe todos los datos y los valida antes de guardarlos
  constructor(nombre, fecha, intensidad, gatillante, frecuencia, id, isActive) {
    // Si no viene un id (caso de creación nueva), generamos uno automáticamente
    this.#id = id || crypto.randomUUID();
    this.#nombre = this.#validarTexto(nombre, "nombre");
    this.#fecha = this.#validarFecha(fecha);
    this.#intensidad = this.#validarIntensidad(intensidad);
    this.#gatillante = this.#validarTexto(gatillante, "gatillante");
    this.#frecuencia = this.#validarFrecuencia(frecuencia);
    // Si no viene isActive, por defecto es true (registro activo)
    this.#isActive = isActive ?? true;
  }

  // =========================================
  // VALIDACIONES PRIVADAS
  // Solo pueden usarse dentro de esta clase
  // =========================================

  // Valida que un campo de texto no esté vacío
  #validarTexto(valor, campo) {
    if (!valor || typeof valor !== "string" || !valor.trim()) {
      throw new ValidationError(
        `El campo ${campo} es obligatorio y debe ser texto`,
      );
    }
    return valor.trim();
  }

  // Valida que la fecha tenga el formato correcto: YYYY-MM-DD
  #validarFecha(fecha) {
    if (!fecha || typeof fecha !== "string") {
      throw new ValidationError("La fecha es obligatoria");
    }
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) {
      throw new ValidationError("La fecha debe tener formato YYYY-MM-DD");
    }
    return fecha;
  }

  // Valida que la intensidad sea un número entre 1 y 5
  #validarIntensidad(intensidad) {
    const num = Number(intensidad);
    if (isNaN(num) || num < 1 || num > 5) {
      throw new ValidationError("La intensidad debe ser un número entre 1 y 5");
    }
    return num;
  }

  // Valida que la frecuencia sea un número positivo
  #validarFrecuencia(frecuencia) {
    const num = Number(frecuencia);
    if (isNaN(num) || num < 1) {
      throw new ValidationError("La frecuencia debe ser un número mayor a 0");
    }
    return num;
  }

  // =========================================
  // GETTERS
  // Permiten leer los campos privados desde fuera
  // =========================================
  get id() {
    return this.#id;
  }
  get nombre() {
    return this.#nombre;
  }
  get fecha() {
    return this.#fecha;
  }
  get intensidad() {
    return this.#intensidad;
  }
  get gatillante() {
    return this.#gatillante;
  }
  get frecuencia() {
    return this.#frecuencia;
  }
  get isActive() {
    return this.#isActive;
  }

  // =========================================
  // MÉTODOS DE ESTADO
  // =========================================

  // Marca el registro como inactivo (borrado lógico)
  desactivar() {
    this.#isActive = false;
  }

  // Reactiva un registro previamente desactivado
  activar() {
    this.#isActive = true;
  }

  // =========================================
  // SERIALIZACIÓN
  // Convierte la instancia a un objeto plano JSON
  // =========================================
  toJSON() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      fecha: this.#fecha,
      intensidad: this.#intensidad,
      gatillante: this.#gatillante,
      frecuencia: this.#frecuencia,
      isActive: this.#isActive,
    };
  }

  // Método estático de fábrica: crea una instancia de Conducta desde un objeto plano
  // Se usa al leer desde el JSON o recibir datos del body de la request
  static create(data) {
    const { nombre, fecha, intensidad, gatillante, frecuencia, id, isActive } =
      data;
    return new Conducta(
      nombre,
      fecha,
      intensidad,
      gatillante,
      frecuencia,
      id,
      isActive,
    );
  }
}
