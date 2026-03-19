## TEA API

API REST desarrollada con **Node.js** y **Express** como backend para una aplicación de apoyo a niños con Trastorno del Espectro Autista (TEA). Permite registrar, gestionar y hacer seguimiento de conductas observadas, incluyendo su intensidad, gatillante y frecuencia.

# Descripción

El sistema está diseñado para apoyar a educadores, terapeutas y familias en el registro y análisis de conductas de niños con TEA. Cada registro incluye información detallada sobre el contexto en que ocurre la conducta, permitiendo identificar patrones y tomar decisiones más informadas.

## Tecnologías utilizadas

- **Node.js** v23+
- **Express** v4
- **Nodemailer** — envío de correos
- **Dotenv** — variables de entorno
- **Nodemon** — recarga automática en desarrollo
- Persistencia en archivos **JSON**

## Códigos de estado HTTP utilizados

| 200 | OK — operación exitosa |
| 201 | Created — recurso creado |
| 400 | Bad Request — error de validación |
| 404 | Not Found — recurso no encontrado |
| 500 | Internal Server Error — error del servidor |

Autora

Desarrollado por **Jessica Solar** como proyecto del curso de JavaScript — Módulo 6.
