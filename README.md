# RELIC — Curated Vintage Store

Storefront público para una tienda de ropa vintage ficticia, acompañado por un backend de inventario y una API REST para integraciones. La experiencia principal está diseñada para clientes: descubrir colecciones, explorar prendas únicas, agregarlas al carrito y completar un checkout de demostración.

## Qué incluye

- Home editorial con fotografías originales, colecciones destacadas y narrativa de marca.
- Catálogo público con 120 prendas, filtros por categoría y talle, búsqueda y ordenamiento.
- Ficha de producto con condición, era, medidas, disponibilidad y productos relacionados.
- Carrito lateral persistente mediante `localStorage` y checkout completo de demostración.
- Página de historia, criterios de selección, guía de talles, envíos y devoluciones.
- Backend existente con 72 clientes, 248 ventas, inventario y reservas coherentes.
- API REST `/api/v1` con autenticación opcional por Bearer token.
- Prisma + PostgreSQL/Supabase, seed reproducible y Docker.
- Modo demo listo para usar sin credenciales externas.

## Inicio rápido (modo demo)

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). `DEMO_MODE=true` utiliza el dataset determinístico local y habilita la tienda y los endpoints sin una base externa. Las mutaciones persisten durante la vida del proceso.

## Configurar Supabase

1. Crear un proyecto en Supabase.
2. En **Project Settings → Database**, copiar la URL del pooler transaccional a `DATABASE_URL` y la conexión directa (puerto 5432) a `DIRECT_URL`.
3. Escapar caracteres especiales de la contraseña en formato URL.
4. Actualizar `.env`:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:5432/postgres"
API_KEY="demo_replace_with_a_long_random_value"
DEMO_MODE="true"
```

El esquema Prisma representa la fuente de verdad para Supabase. El modo de datos incluido mantiene la demo ejecutable incluso antes de aprovisionar la base.

## Migraciones y seed

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

El seed limpia únicamente las tablas RELIC y crea 8 categorías, 120 productos, 72 clientes, 248 ventas relacionadas, 96 movimientos y 14 reservas. No usa información real.

Para aplicar migraciones existentes en un entorno desplegado:

```bash
npm run db:deploy
```

## Docker

No se crea PostgreSQL dentro de Docker. El contenedor recibe las conexiones de Supabase por variables de entorno.

```bash
docker compose up --build
```

Sin variables configuradas, Compose arranca en `DEMO_MODE=true`. Para conectarlo a Supabase, crear `.env` a partir de `.env.example` antes de levantarlo.

## API REST

El índice de endpoints está disponible en `GET /api/v1`. Si `API_KEY` está vacío, la API queda abierta para desarrollo. Si está definido, enviar:

```http
Authorization: Bearer demo_xxxxxxxxx
```

Las listas responden con `{ data, meta }`; los recursos individuales con `{ data }`. Parámetros comunes: `page` y `limit` (máximo 100).

### Productos

```bash
curl "http://localhost:3000/api/v1/products/search?q=leather&size=M&color=black&inStock=true"
curl "http://localhost:3000/api/v1/products/prd_0003"
```

Filtros de búsqueda: `q`, `category`, `brand`, `size`, `color`, `minPrice`, `maxPrice`, `inStock`.

### Clientes y compras

```bash
curl "http://localhost:3000/api/v1/customers?q=Sofia"
curl "http://localhost:3000/api/v1/customers/cus_0001/purchases"
```

### Ventas e inventario

```bash
curl "http://localhost:3000/api/v1/sales?status=completed"
curl "http://localhost:3000/api/v1/inventory?lowStock=true"
curl "http://localhost:3000/api/v1/inventory/prd_0003"
```

### Crear y cancelar una reserva

```bash
curl -X POST "http://localhost:3000/api/v1/reservations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo_xxxxxxxxx" \
  -d '{"customerId":"cus_0001","productId":"prd_0003","quantity":1}'

curl -X DELETE "http://localhost:3000/api/v1/reservations/res_0001" \
  -H "Authorization: Bearer demo_xxxxxxxxx"
```

La creación comprueba cliente, producto y stock disponible; luego incrementa `reservedStock` y registra un movimiento. La cancelación libera ese stock.

## Estructura

```text
src/app/                 UI y Route Handlers
src/lib/services/        lógica de negocio reutilizable
src/lib/demo-data.ts     dataset determinístico de la demo
prisma/schema.prisma     modelo PostgreSQL
prisma/seed.ts           seed relacional reproducible
public/products/         imágenes locales consistentes
```

## Verificación

```bash
npm run typecheck
npm run build
```

No se implementan pagos, auth de usuarios, e-commerce público, envíos ni servicios externos: el alcance se mantiene deliberadamente enfocado en la demo de operaciones y voz.
