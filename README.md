# TEA API

API REST desarrollada con **Node.js** y **Express** como backend para una aplicación de apoyo a niños con Trastorno del Espectro Autista (TEA). Permite registrar, gestionar y hacer seguimiento de conductas observadas, incluyendo su intensidad, gatillante y frecuencia.

## Descripción

El sistema está diseñado para apoyar a educadores, terapeutas y familias en el registro y análisis de conductas de niños con TEA. Cada registro incluye información detallada sobre el contexto en que ocurre la conducta, permitiendo identificar patrones y tomar decisiones más informadas.

## Tecnologías utilizadas

- **Node.js** v23+
- **Express** v4
- **Nodemailer**: envío de correos
- **Dotenv**: variables de entorno
- **Nodemon**: recarga automática en desarrollo
- Persistencia en archivos **JSON**

## Requisitos

- [Node.js](https://nodejs.org/) v23 o superior
- npm (se instala junto con Node.js)

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/Jessicasolaru/tea-api
cd tea-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo de variables de entorno:

```bash
cp .env.example .env
```

Edita `.env` con tus datos (ver la tabla de variables más abajo).

4. Iniciar el servidor:

```bash
# Modo desarrollo (recarga automática con nodemon)
npm run dev

# Modo normal
npm start
```

El servidor queda disponible en `http://localhost:3000` (o en el puerto que definas en `PORT`).

## Variables de entorno

| Variable      | Descripción                                                           |
| ------------- | --------------------------------------------------------------------- |
| `PORT`        | Puerto del servidor (por defecto 3000)                                |
| `ENVIRONMENT` | Entorno de ejecución: `development` o `production`                    |
| `MAIL_HOST`   | Servidor SMTP (por ejemplo `smtp.gmail.com`)                          |
| `MAIL_PORT`   | Puerto SMTP (587 o 465)                                               |
| `MAIL_SECURE` | `true` para el puerto 465, `false` para el 587                        |
| `MAIL_USER`   | Correo con el que se envían los mensajes                              |
| `MAIL_PASS`   | Contraseña de aplicación (con Gmail no funciona la contraseña normal) |

## Estructura del proyecto

El código está organizado por capas: las rutas reciben la petición, el controlador la delega al servicio, y el servicio usa el modelo para validar y guardar los datos.

```
src/
├── main.js          # Punto de entrada
├── routes/          # Definición de rutas
├── controllers/     # Manejo de request y response
├── services/        # Lógica de negocio
├── models/          # Modelo Conducta con validaciones
├── utils/           # Errores personalizados, logger y lectura/escritura de archivos
└── data/            # Archivo JSON con las conductas
```

## Modelo de datos

### Conducta

| Campo        | Tipo     | Descripción                                                         |
| ------------ | -------- | ------------------------------------------------------------------- |
| `id`         | UUID     | Identificador, se genera automáticamente                            |
| `nombre`     | Texto    | Nombre de la conducta (obligatorio)                                 |
| `fecha`      | Texto    | Fecha de la observación, formato `YYYY-MM-DD` (obligatorio)         |
| `intensidad` | Número   | Intensidad de la conducta, de 1 a 5 (obligatorio)                   |
| `gatillante` | Texto    | Situación que desencadena la conducta (obligatorio)                 |
| `frecuencia` | Número   | Frecuencia de la conducta, mínimo 1 (obligatorio)                   |
| `isActive`   | Booleano | `true` por defecto. Pasa a `false` al eliminar (eliminación lógica) |

### Validaciones (error `400`)

| Campo        | Mensaje de error                                                 |
| ------------ | ---------------------------------------------------------------- |
| `nombre`     | El campo nombre es obligatorio y debe ser texto                  |
| `fecha`      | La fecha es obligatoria / La fecha debe tener formato YYYY-MM-DD |
| `intensidad` | La intensidad debe ser un número entre 1 y 5                     |
| `gatillante` | El campo gatillante es obligatorio y debe ser texto              |
| `frecuencia` | La frecuencia debe ser un número mayor a 0                       |

## Endpoints

URL base: `http://localhost:3000/api/v1`

### Conductas

| Método | Ruta             | Descripción                                                                                   |
| ------ | ---------------- | --------------------------------------------------------------------------------------------- |
| GET    | `/conductas`     | Obtiene todas las conductas activas. Acepta `?limit=N` para limitar la cantidad de resultados |
| GET    | `/conductas/:id` | Obtiene una conducta activa por su ID                                                         |
| POST   | `/conductas`     | Crea una nueva conducta                                                                       |
| PUT    | `/conductas/:id` | Actualiza una conducta existente                                                              |
| DELETE | `/conductas/:id` | Elimina una conducta (eliminación lógica, _soft delete_)                                      |

#### POST `/conductas`

Body:

```json
{
  "nombre": "Golpear la mesa",
  "fecha": "2026-10-20",
  "intensidad": 3,
  "gatillante": "Cambio de rutina",
  "frecuencia": 2
}
```

Respuesta `201`:

```json
{
  "message": "Conducta registrada con éxito",
  "statusCode": 201,
  "data": {
    "id": "3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90",
    "nombre": "Golpear la mesa",
    "fecha": "2026-10-20",
    "intensidad": 3,
    "gatillante": "Cambio de rutina",
    "frecuencia": 2,
    "isActive": true
  }
}
```

#### GET `/conductas`

Ejemplo: `/conductas?limit=10`

Respuesta `200`:

```json
{
  "message": "Conductas obtenidas con éxito",
  "statusCode": 200,
  "total": 1,
  "data": [
    {
      "id": "3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90",
      "nombre": "Golpear la mesa",
      "fecha": "2026-10-20",
      "intensidad": 3,
      "gatillante": "Cambio de rutina",
      "frecuencia": 2,
      "isActive": true
    }
  ]
}
```

#### GET `/conductas/:id`

Respuesta `200`:

```json
{
  "message": "Conducta encontrada con éxito",
  "statusCode": 200,
  "data": {
    "id": "3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90",
    "nombre": "Golpear la mesa",
    "fecha": "2026-10-20",
    "intensidad": 3,
    "gatillante": "Cambio de rutina",
    "frecuencia": 2,
    "isActive": true
  }
}
```

#### PUT `/conductas/:id`

Reemplaza la conducta completa, por lo que el body debe incluir todos los campos obligatorios. El `id` se mantiene.

Body:

```json
{
  "nombre": "Golpear la mesa",
  "fecha": "2026-10-20",
  "intensidad": 2,
  "gatillante": "Cambio de rutina",
  "frecuencia": 1
}
```

Respuesta `200`:

```json
{
  "message": "Conducta actualizada con éxito",
  "statusCode": 200,
  "data": {
    "id": "3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90",
    "nombre": "Golpear la mesa",
    "fecha": "2026-10-20",
    "intensidad": 2,
    "gatillante": "Cambio de rutina",
    "frecuencia": 1,
    "isActive": true
  }
}
```

#### DELETE `/conductas/:id`

Desactiva la conducta (`isActive = false`), no la borra del archivo.

Respuesta `200`:

```json
{
  "message": "Conducta con id 3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90 eliminada correctamente",
  "statusCode": 200
}
```

#### Errores `404 Not Found`

| Operación               | Mensaje                                |
| ----------------------- | -------------------------------------- |
| GET `/conductas/:id`    | Conducta no encontrada                 |
| PUT `/conductas/:id`    | Conducta no encontrada para actualizar |
| DELETE `/conductas/:id` | Conducta no encontrada para eliminar   |

Se devuelve `404` cuando no existe una conducta **activa** con ese ID, o cuando aún no hay registros guardados.

### Correo

#### POST `/mail`

Envía un correo electrónico. Los tres campos son obligatorios.

Body:

```json
{
  "to": "destinatario@correo.com",
  "subject": "Resumen semanal de conductas",
  "message": "Hola, adjunto el resumen de esta semana."
}
```

Respuesta `200`:

```json
{
  "message": "Correo enviado con éxito",
  "statusCode": 200,
  "data": {
    "messageId": "<id-del-mensaje@servidor>",
    "to": ["destinatario@correo.com"]
  }
}
```

Respuesta `400` (falta algún campo):

```json
{
  "message": "Los campos to, subject y message son obligatorios",
  "statusCode": 400
}
```

## Códigos de estado HTTP utilizados

| Código | Significado           | Cuándo se usa          |
| ------ | --------------------- | ---------------------- |
| 200    | OK                    | Operación exitosa      |
| 201    | Created               | Conducta creada        |
| 400    | Bad Request           | Error de validación    |
| 404    | Not Found             | Conducta no encontrada |
| 500    | Internal Server Error | Error del servidor     |

## Persistencia

Los datos se guardan en el archivo `src/data/conductas.json`. Al crearse la primera conducta, la API genera el archivo si no existe.

## Autora

Desarrollado por **Jessica Solar** como proyecto del curso de Desarrollo de Aplicaciones FullStack JavaScript, Módulo 6.
