# Manual de integración para asistentes de IA

Este documento permite conectar un asistente conversacional al catálogo público de RELIC sin navegar ni interpretar el HTML de la tienda.

## Objetivo

Cuando una persona describa una prenda, el asistente debe consultar la API de catálogo, mostrar solo resultados devueltos por ella y dirigir a la ficha de producto correspondiente.

Tienda pública: `https://relic-mockup.vercel.app`  
Base de API: `https://relic-mockup.vercel.app/api/v1`

## Alcance autorizado para el bot

El bot debe usar exclusivamente operaciones de lectura de catálogo:

- `GET /products/search`
- `GET /products/{id}`

No debe crear ni modificar productos, reservas, ventas, clientes ni stock. El checkout es una demostración y el bot no debe prometer pagos, compras confirmadas ni reservas reales.

## Búsqueda de productos

```http
GET /api/v1/products/search
```

Parámetros opcionales:

| Parámetro | Ejemplo | Uso |
| --- | --- | --- |
| `q` | `leather` | Texto libre en nombre, marca, descripción, SKU o color. |
| `category` | `Jackets` | Categoría canónica. |
| `brand` | `Nike` | Marca. |
| `size` | `M` | Talle. |
| `color` | `black` | Color canónico. |
| `minPrice` | `80` | Precio mínimo en USD. |
| `maxPrice` | `180` | Precio máximo en USD. |
| `inStock` | `true` | Mostrar solo prendas disponibles. |
| `page` / `limit` | `1` / `12` | Paginación; `limit` máximo 100. |

Ejemplo: cliente que pide “una campera negra talle M”.

```text
GET https://relic-mockup.vercel.app/api/v1/products/search?category=Jackets&color=black&size=M&inStock=true&limit=12
```

La respuesta tiene el formato:

```json
{
  "data": [{
    "id": "prd_0075",
    "name": "Wilson Leather Jacket · Heritage",
    "brand": "Wilson",
    "category": "Jackets",
    "color": "black",
    "size": "M",
    "price": 155,
    "stock": 3,
    "reservedStock": 0,
    "image": "/products/photos/wilson-leather-jacket.webp"
  }],
  "meta": { "total": 1, "page": 1, "limit": 12, "pages": 1 }
}
```

## Llevar a la ficha correcta

Nunca usar automatización de navegador. Con el `id` de cada resultado, construir:

```text
https://relic-mockup.vercel.app/products/{id}
```

Ejemplo: `prd_0075` corresponde a:

```text
https://relic-mockup.vercel.app/products/prd_0075
```

Para obtener una imagen absoluta, anteponer el dominio de la tienda al valor de `image`.

```text
https://relic-mockup.vercel.app/products/photos/wilson-leather-jacket.webp
```

## Normalización desde español

Antes de llamar a la API, el bot debe transformar la intención de la persona a los valores canónicos actuales.

| Persona dice | Enviar a la API |
| --- | --- |
| campera, chaqueta | `category=Jackets` |
| jean, vaquero | `category=Jeans` |
| remera, polo | `category=Tops` |
| buzo | `category=Sweatshirts` |
| tejido, sweater | `category=Knitwear` |
| camisa | `category=Shirts` |
| abrigo, trench, chaleco | `category=Outerwear` |
| pantalón | `category=Trousers` |
| negro | `color=black` |
| azul | `color=blue` |
| azul marino | `color=navy` |
| verde | `color=green` |
| blanco | `color=white` |
| gris | `color=grey` |
| rojo | `color=red` |
| bordó | `color=burgundy` |

Los talles se envían como `XS`, `S`, `M`, `L` o `XL`.

## Contrato recomendado para la herramienta del bot

```json
{
  "name": "buscar_productos_relic",
  "description": "Busca prendas vintage disponibles en el catálogo RELIC. Usar para responder consultas de productos; no realizar compras ni reservas.",
  "parameters": {
    "type": "object",
    "properties": {
      "q": { "type": "string" },
      "category": { "type": "string" },
      "brand": { "type": "string" },
      "size": { "type": "string", "enum": ["XS", "S", "M", "L", "XL"] },
      "color": { "type": "string" },
      "minPrice": { "type": "number" },
      "maxPrice": { "type": "number" }
    }
  }
}
```

La implementación de esa herramienta debe añadir siempre `inStock=true` y `limit=12` a la consulta.

## Comportamiento conversacional

1. Extraer categoría, color, talle, marca y presupuesto del mensaje.
2. Normalizar los valores con la tabla anterior.
3. Consultar la API con `inStock=true`.
4. Recomendar como máximo tres resultados, con nombre, talle, precio en USD y el enlace directo.
5. Si no hay resultados, no inventar productos. Ofrecer relajar un único filtro: talle, color, presupuesto o categoría.
6. Si la persona elige una prenda, devolver su enlace directo y aclarar que el checkout es de demostración.

## Limitaciones actuales del mockup

- El catálogo es demostrativo; no hay pagos reales.
- El carrito es local al navegador.
- La API de catálogo está publicada junto con el frontend en Vercel.
- Las modificaciones hechas mediante rutas administrativas no deben usarse para una integración pública.

