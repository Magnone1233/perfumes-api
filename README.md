# Fragrances API

API NestJS para administrar fragrances con CRUD completo, persistencia en MySQL y carga de imagen por `multipart/form-data`.

## Qué incluye

- CRUD REST de fragrances
- Persistencia con TypeORM + MySQL
- Validación con DTOs y `class-validator`
- Upload local de imágenes en `uploads/fragrances`
- Exposición estática de imágenes bajo `/uploads`

## Fragrance model

- `name`: string obligatorio
- `description`: string opcional
- `price`: número obligatorio mayor a 0
- `promotionalPrice`: número opcional menor que `price`
- `stock`: entero obligatorio mayor o igual a 0
- `image`: ruta generada por el backend al subir archivo

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Crear tu archivo `.env` usando `.env.example` como base.

3. Asegurarte de tener creada la base de datos MySQL.

## Variables de entorno

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=fragrances_store
DB_SYNCHRONIZE=true
```

## Ejecutar el proyecto

```bash
npm run start:dev
```

## Endpoints

- `POST /fragrances`
- `GET /fragrances`
- `GET /fragrances/:id`
- `PATCH /fragrances/:id`
- `DELETE /fragrances/:id`

## Ejemplo en Postman

Para `POST /fragrances` y `PATCH /fragrances/:id`, usar `form-data`:

- `name`: `Bleu de Chanel`
- `description`: `Amaderado cítrico`
- `price`: `120.50`
- `promotionalPrice`: `99.99`
- `stock`: `15`
- `image`: archivo `jpg`, `png` o `webp`

## Notas

- Las imágenes se guardan localmente en el servidor.
- El backend persiste solo la ruta de la imagen en la base.
- `DB_SYNCHRONIZE=true` sirve para desarrollo; en producción conviene migraciones.
