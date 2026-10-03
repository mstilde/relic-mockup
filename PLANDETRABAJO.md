# MVP — Vintage Store / Voice Agent Integration Demo

## Contexto

Quiero construir un **MVP funcional de una tienda de ropa vintage ficticia**.

El objetivo principal NO es crear un e-commerce ni un ERP completo.

El objetivo es crear un **entorno de demostración realista para una empresa que
desarrolla asistentes virtuales mediante llamadas de voz**.

El asistente de voz podrá interactuar con el sistema de la tienda mediante una
API para consultar información y realizar algunas acciones.

La aplicación debe parecer y comportarse como un sistema real de gestión de una
pequeña tienda de ropa, pero mantenerse deliberadamente simple.

La prioridad es:

1. Realismo.
2. Buena UX.
3. API limpia y fácil de integrar.
4. Datos ficticios pero creíbles.
5. Código simple y mantenible.
6. No sobrearquitecturar.

---

# Stack obligatorio

## Frontend / Backend

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui

## Database

- Supabase
- PostgreSQL

Supabase se utilizará principalmente como **PostgreSQL gestionado**.

No utilizar inicialmente:

- Supabase Auth
- Supabase Edge Functions
- Supabase Realtime
- Supabase Storage
- RLS complejo

## ORM

- Prisma

## Infraestructura

- Docker
- Docker Compose

Docker debe utilizarse para facilitar la reproducibilidad del entorno.

**NO crear otro PostgreSQL dentro de Docker**, ya que la base de datos estará en
Supabase.

---

# Concepto del negocio

Crear una tienda ficticia de ropa vintage llamada:

**RELIC — Vintage Clothing**

Debe parecer una pequeña tienda moderna especializada en ropa vintage.

La aplicación debe tener un diseño profesional, limpio y moderno.

No debe parecer un proyecto académico ni un CRUD genérico.

---

# Objetivo de la aplicación

La aplicación representa el sistema interno de la tienda.

Debe permitir:

- consultar productos
- consultar stock
- consultar clientes
- consultar ventas
- consultar historial de compras
- crear reservas

La aplicación tendrá dos usuarios principales:

### 1. Empleado de la tienda

Utiliza el dashboard web.

### 2. Asistente virtual

No utiliza directamente la interfaz.

Interactúa con el sistema mediante la API REST.

---

# Arquitectura

La arquitectura conceptual debe ser:

```text
┌──────────────────────┐
│    Voice Assistant   │
│                      │
│ "Busco una campera   │
│  de cuero talle M"   │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│       Next.js        │
│      API Routes      │
└──────────┬───────────┘
           │
           ▼
       Prisma
           │
           ▼
┌──────────────────────┐
│       Supabase       │
│      PostgreSQL      │
└──────────────────────┘
```

El dashboard web utiliza los mismos servicios/backend que la API.

---

# Principio importante: API-first

Aunque el dashboard sea una parte importante de la aplicación, el sistema debe
diseñarse pensando desde el comienzo en que un agente externo consumirá la API.

No hacer que la lógica de negocio exista únicamente dentro de componentes React.

La lógica debe estar separada en servicios reutilizables.

Por ejemplo:

```text
/lib/services/
    products.ts
    customers.ts
    sales.ts
    inventory.ts
    reservations.ts
```

Los endpoints de la API deben utilizar esos servicios.

El frontend también debería utilizar la misma lógica cuando corresponda.

---

# Funcionalidades del MVP

## 1. Dashboard

Crear una pantalla principal con:

- Ventas de hoy
- Ventas del mes
- Cantidad de productos
- Cantidad de clientes
- Productos con stock bajo
- Últimas ventas
- Actividad reciente

No hace falta crear gráficos complejos.

Un gráfico sencillo de ventas puede ser suficiente si mejora la apariencia.

---

# 2. Productos

Crear un catálogo interno.

Cada producto debe tener aproximadamente:

```text
id
sku
name
description
category
brand
size
color
material
price
stock
image
createdAt
updatedAt
```

No es necesario implementar todas las propiedades si complican innecesariamente
el proyecto.

Debe poder:

- listar productos
- buscar productos
- filtrar productos
- ver detalle
- modificar stock
- crear producto
- editar producto

La pantalla de productos debe parecer una herramienta que realmente utilizaría
un empleado.

---

# 3. Datos de productos

Crear productos ficticios realistas.

NO utilizar nombres genéricos como:

```text
Product 001
Product 002
Test Product
```

Usar productos como:

```text
Vintage Levi's 501
Nike Windbreaker 1998
Wilson Leather Jacket
Adidas Track Jacket 90s
Carhartt Work Jacket
Vintage Lacoste Polo
Wrangler Cowboy Jeans
Nike ACG Fleece
Vintage Champion Hoodie
```

Cada producto debe tener:

- descripción realista
- precio
- talle
- color
- marca
- stock
- categoría
- imagen cuando sea posible

Generar suficientes productos para que el sistema parezca real.

Objetivo inicial:

**aproximadamente 100–150 productos.**

---

# 4. Clientes

Crear una sección de clientes.

Campos mínimos:

```text
id
name
phone
email
createdAt
```

La ficha del cliente debe mostrar:

- información básica
- cantidad de compras
- total gastado
- última compra
- historial de compras

Crear aproximadamente:

**50–100 clientes ficticios.**

Los datos deben ser claramente ficticios.

---

# 5. Ventas

Crear una sección de ventas.

Una venta debe tener:

```text
id
customer
items
subtotal
discount
total
paymentMethod
status
createdAt
```

Los métodos de pago pueden ser:

```text
cash
transfer
card
```

NO integrar ningún proveedor de pagos.

Una venta debe contener uno o varios productos.

Crear suficientes ventas ficticias para que el dashboard tenga historial.

Objetivo inicial:

**aproximadamente 200–300 ventas ficticias.**

---

# 6. Inventario

No crear un sistema de inventario extremadamente complejo.

Debe ser suficiente para:

- consultar stock
- detectar stock bajo
- modificar stock
- registrar movimientos básicos

Por ejemplo:

```text
StockMovement

id
productId
type
quantity
reason
createdAt
```

Tipos:

```text
purchase
sale
adjustment
reservation
release
```

---

# 7. Reservas

Esta funcionalidad es especialmente importante porque será una de las acciones
que puede realizar el agente.

Crear:

```text
Reservation

id
customerId
productId
quantity
status
expiresAt
createdAt
```

Estados:

```text
pending
confirmed
cancelled
expired
```

Cuando se crea una reserva:

- comprobar que existe stock disponible
- crear la reserva
- reducir el stock disponible o aumentar `reservedStock`
- devolver información de la reserva

No hace falta implementar pagos ni checkout.

---

# API REST

Crear una API versionada:

```text
/api/v1/
```

## Productos

```http
GET /api/v1/products
GET /api/v1/products/search
GET /api/v1/products/:id
POST /api/v1/products
PATCH /api/v1/products/:id
```

La búsqueda debe permitir filtros razonables como:

```text
q
category
brand
size
color
minPrice
maxPrice
inStock
```

Ejemplo conceptual:

```text
GET /api/v1/products/search?q=leather%20jacket&size=M&color=black&inStock=true
```

---

## Clientes

```http
GET /api/v1/customers
GET /api/v1/customers/:id
GET /api/v1/customers/:id/purchases
```

---

## Ventas

```http
GET /api/v1/sales
GET /api/v1/sales/:id
```

Permitir filtros básicos por:

```text
customer
date
status
```

---

## Inventario

```http
GET /api/v1/inventory
GET /api/v1/inventory/:productId
```

---

## Reservas

```http
GET /api/v1/reservations
GET /api/v1/reservations/:id
POST /api/v1/reservations
DELETE /api/v1/reservations/:id
```

---

# API Authentication

Para este MVP no implementar un sistema de autenticación completo.

Sin embargo, estructurar la API de forma que posteriormente pueda utilizar una
API key.

Por ejemplo:

```http
Authorization: Bearer demo_xxxxxxxxx
```

Puede utilizarse una API key fija mediante variable de entorno para proteger los
endpoints externos.

No construir OAuth ni un sistema de usuarios completo.

---

# Servicios de negocio

Separar la lógica de negocio de las rutas HTTP.

Por ejemplo:

```text
searchProducts()
getProduct()
getCustomer()
getCustomerPurchases()
getInventory()
getSales()
createReservation()
cancelReservation()
```

Esto es importante porque posteriormente el agente de voz debería poder llamar a
estas operaciones sin depender de la interfaz web.

---

# Ejemplos de interacción del agente

El sistema debe permitir conceptualmente casos como estos.

### Caso 1 — Buscar producto

Usuario:

> "Estoy buscando una campera de cuero negra talle M."

El agente debería poder consultar:

```text
GET /api/v1/products/search
```

y recibir productos compatibles.

---

### Caso 2 — Comparar precios

Usuario:

> "¿Cuál es la más barata?"

El agente utiliza los resultados obtenidos y responde con el producto
correspondiente.

---

### Caso 3 — Consultar stock

Usuario:

> "¿Cuántas unidades quedan?"

El agente consulta el stock actual.

---

### Caso 4 — Historial del cliente

Usuario:

> "¿Cuándo fue mi última compra?"

El agente:

1. identifica al cliente
2. consulta sus compras
3. obtiene la última venta
4. responde

---

### Caso 5 — Reserva

Usuario:

> "Quiero reservar la campera Wilson."

El agente:

1. busca el producto
2. comprueba disponibilidad
3. identifica al cliente
4. crea la reserva
5. devuelve confirmación

Este es uno de los escenarios más importantes de la demo.

---

# Seed de base de datos

Crear un sistema de seed reproducible:

```text
prisma/seed.ts
```

Debe crear:

- 100–150 productos
- 50–100 clientes
- 200–300 ventas
- movimientos de inventario
- varias reservas
- categorías
- datos suficientes para el dashboard

Los datos deben ser coherentes entre sí.

Por ejemplo:

Si un producto aparece en una venta, debe existir.

Si un cliente tiene 8 compras, esas ventas deben existir realmente.

El stock debe ser consistente con las ventas y reservas iniciales.

No generar simplemente datos aleatorios sin relaciones lógicas.

---

# UI / UX

La interfaz debe sentirse como un producto SaaS real.

Sidebar:

```text
RELIC

Dashboard
Products
Customers
Sales
Inventory
Reservations
```

Usar:

- shadcn/ui
- tablas
- badges
- cards
- dialogs
- dropdowns
- filtros
- estados de carga
- empty states
- toast notifications

Evitar una estética excesivamente compleja.

Priorizar:

- legibilidad
- consistencia
- navegación rápida
- aspecto profesional

---

# Imágenes

Utilizar imágenes locales o placeholders consistentes.

No depender de APIs externas de imágenes para que el proyecto funcione.

Las imágenes de productos pueden estar en:

```text
/public/products/
```

Si no se dispone de imágenes reales, utilizar placeholders visualmente
coherentes.

---

# Docker

Crear:

```text
Dockerfile
compose.yaml
.dockerignore
```

Docker debe permitir levantar la aplicación de manera reproducible.

No ejecutar PostgreSQL dentro de Docker.

La aplicación debe conectarse a Supabase mediante:

```text
DATABASE_URL
```

---

# Variables de entorno

Crear:

```text
.env.example
```

con variables como:

```env
DATABASE_URL=
DIRECT_URL=
API_KEY=
```

Nunca incluir credenciales reales en el repositorio.

---

# Prisma

Crear un schema Prisma limpio y fácil de entender.

Priorizar relaciones claras sobre abstracciones innecesarias.

Modelos mínimos esperados:

```text
Product
Category
Customer
Sale
SaleItem
StockMovement
Reservation
```

Se pueden agregar modelos adicionales si son realmente necesarios, pero no crear
entidades innecesarias.

---

# Qué NO implementar

Este punto es muy importante.

No implementar en este MVP:

- pagos reales
- Mercado Pago
- Stripe
- facturación fiscal
- AFIP
- e-commerce público
- carrito de compras
- shipping
- tracking de envíos
- autenticación compleja
- OAuth
- multi-tenancy
- roles y permisos avanzados
- notificaciones SMS
- WhatsApp
- emails reales
- integración real con Shopify
- integración real con otros POS
- microservicios
- Kubernetes
- Redis
- colas
- WebSockets
- IA dentro de la aplicación
- sistema de recomendación
- analytics avanzado

Todo eso puede agregarse posteriormente.

---

# Prioridad de implementación

Implementar en este orden:

## Fase 1

Proyecto base:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Prisma
- Supabase
- Docker
- variables de entorno

## Fase 2

Base de datos:

- schema Prisma
- migraciones
- seed

## Fase 3

Productos:

- listado
- búsqueda
- filtros
- detalle
- edición

## Fase 4

Clientes:

- listado
- detalle
- historial de compras

## Fase 5

Ventas:

- listado
- detalle
- dashboard

## Fase 6

Inventario:

- stock
- movimientos
- stock bajo

## Fase 7

Reservas:

- creación
- consulta
- cancelación

## Fase 8

API REST:

- products
- customers
- sales
- inventory
- reservations

## Fase 9

Testing manual de los escenarios del agente.

---

# Criterio de éxito

El MVP se considera terminado cuando una persona pueda abrir la aplicación y
pensar:

> "Esto parece el sistema real de una tienda."

Y, simultáneamente, un desarrollador pueda consumir la API y hacer operaciones
como:

```text
Buscar productos
Consultar precios
Consultar stock
Consultar clientes
Consultar historial de compras
Consultar ventas
Crear una reserva
Cancelar una reserva
```

El proyecto debe ser suficientemente realista para utilizarlo como **demo
comercial de un asistente virtual de voz**.

---

# Filosofía de desarrollo

No sobreingenierizar.

Si una funcionalidad puede implementarse de forma simple y clara, elegir la
solución simple.

No crear abstracciones "por si algún día".

No construir infraestructura de producción.

No agregar funcionalidades fuera del alcance.

Priorizar un MVP pequeño, completo y coherente antes que una aplicación enorme e
incompleta.

El resultado debe ser un **sandbox de negocio realista**, no un ERP completo.

---

# Entregable final

Al finalizar debe existir:

1. Aplicación web funcional.
2. Dashboard.
3. Productos.
4. Clientes.
5. Ventas.
6. Inventario.
7. Reservas.
8. PostgreSQL en Supabase.
9. Prisma.
10. Seed con datos realistas.
11. API REST versionada.
12. Docker.
13. `.env.example`.
14. README con instrucciones para:

    - instalar
    - configurar Supabase
    - ejecutar migraciones
    - ejecutar seed
    - iniciar desarrollo
    - ejecutar Docker
    - probar la API

Antes de agregar funcionalidades nuevas, verificar que todo lo anterior funcione
correctamente.
