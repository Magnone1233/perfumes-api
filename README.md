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

2. Levantar MySQL con Docker Compose:

```bash
docker compose up -d
```

3. Crear tu archivo `.env` usando `.env.example` como base.

La base `fragrances_store` ya se crea automáticamente con Docker Compose.

## Variables de entorno

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=fragrances_user
DB_PASSWORD=fragrances_pass
DB_NAME=fragrances_store
DB_SYNCHRONIZE=true
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
UPLOADS_DIR=./uploads
```

## MySQL con Docker Compose

El archivo [docker-compose.yml](docker-compose.yml) levanta un contenedor MySQL con esta configuración:

- Host: `localhost`
- Port: `3306`
- Database: `fragrances_store`
- User: `fragrances_user`
- Password: `fragrances_pass`
- Root password: `root`

Comandos útiles:

```bash
docker compose up -d
docker compose ps
docker compose logs -f mysql
docker compose down
```

Si querés borrar también la data persistida:

```bash
docker compose down -v
```

## DBeaver

Para conectarte desde DBeaver:

1. `Database` -> `New Database Connection`
2. Elegí `MySQL`
3. Completá:

- Host: `localhost`
- Port: `3306`
- Database: `fragrances_store`
- Username: `fragrances_user`
- Password: `fragrances_pass`

4. Tocá `Test Connection`
5. Guardá la conexión

Si DBeaver te pide bajar el driver de MySQL, aceptalo.

## Ejecutar el proyecto

```bash
npm run start:dev
```

Si la API corre en tu máquina y MySQL en Docker, `DB_HOST=localhost` es correcto.

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
- En Railway (u otros PaaS), montá un volumen persistente y configurá `UPLOADS_DIR` apuntando a esa ruta; si no, al redeploy podés perder archivos y obtener `404` en `/uploads/...`.
