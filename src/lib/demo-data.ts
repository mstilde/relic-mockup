import type { Customer, Product, Reservation, Sale, StockMovement } from "./types";

const DAY = 86_400_000;
const now = new Date();
const isoAgo = (days: number, hour = 12) => {
  const value = new Date(now.getTime() - days * DAY);
  value.setHours(hour, (days * 17) % 60, 0, 0);
  return value.toISOString();
};

const productTemplates = [
  ["Vintage Levi's 501", "Levi's", "Jeans", "Denim", "blue", "Classic straight-leg denim with an authentic faded wash and softly worn hems."],
  ["Nike Windbreaker 1998", "Nike", "Jackets", "Nylon", "navy", "Lightweight late-nineties shell with embroidered swoosh and contrast paneling."],
  ["Wilson Leather Jacket", "Wilson", "Jackets", "Leather", "black", "Supple genuine leather moto jacket with quilted lining and aged brass hardware."],
  ["Adidas Track Jacket 90s", "Adidas", "Jackets", "Polyester", "green", "Iconic three-stripe track top in deep forest green, sourced in excellent condition."],
  ["Carhartt Work Jacket", "Carhartt", "Jackets", "Cotton duck", "brown", "Rugged chore jacket with blanket lining and a naturally broken-in canvas shell."],
  ["Vintage Lacoste Polo", "Lacoste", "Tops", "Cotton piqué", "cream", "Soft piqué polo with original crocodile embroidery and a relaxed vintage cut."],
  ["Wrangler Cowboy Jeans", "Wrangler", "Jeans", "Denim", "indigo", "High-rise rigid denim with western pocket stitching and a clean dark rinse."],
  ["Nike ACG Fleece", "Nike", "Knitwear", "Fleece", "purple", "Warm technical fleece from the ACG line with zip pockets and contrast binding."],
  ["Vintage Champion Hoodie", "Champion", "Sweatshirts", "Cotton", "grey", "Heavyweight reverse-weave hoodie with subtle collegiate character and patina."],
  ["Ralph Lauren Oxford", "Ralph Lauren", "Shirts", "Oxford cotton", "white", "Timeless button-down with pony embroidery and an easy, slightly oversized shape."],
  ["The North Face Nuptse", "The North Face", "Jackets", "Ripstop", "red", "Boxy insulated puffer with signature baffles and packable hood."],
  ["Pendleton Wool Overshirt", "Pendleton", "Shirts", "Wool", "plaid", "Warm virgin-wool overshirt in a muted heritage check with flap pockets."],
  ["Harley Davidson Tee", "Harley-Davidson", "Tops", "Cotton", "black", "Single-stitch motorcycle tee with a sun-faded dealership graphic."],
  ["Burberry Trench Coat", "Burberry", "Outerwear", "Gabardine", "beige", "Classic double-breasted trench with checked lining and weathered buckles."],
  ["Patagonia Snap-T", "Patagonia", "Knitwear", "Fleece", "teal", "Cozy Synchilla pullover with contrast chest pocket and snap placket."],
  ["Lee Storm Rider", "Lee", "Jackets", "Denim", "blue", "Blanket-lined denim jacket with corduroy collar and genuine workwear wear."],
  ["Reebok Club Crewneck", "Reebok", "Sweatshirts", "Cotton", "burgundy", "Minimal embroidered crewneck in a rich burgundy midweight jersey."],
  ["Tommy Hilfiger Sailing", "Tommy Hilfiger", "Jackets", "Nylon", "yellow", "Color-block sailing jacket with oversized flag branding and mesh lining."],
  ["Dickies 874 Trousers", "Dickies", "Trousers", "Twill", "charcoal", "Durable flat-front work trousers with a crisp crease and relaxed straight leg."],
  ["L.L.Bean Field Coat", "L.L.Bean", "Outerwear", "Canvas", "olive", "Practical barn coat with corduroy collar, roomy pockets and flannel lining."],
  ["Fila Tennis Sweater", "Fila", "Knitwear", "Cotton knit", "cream", "V-neck tennis knit with striped trim and a small embroidered logo."],
  ["Starter Bulls Jacket", "Starter", "Jackets", "Nylon", "red", "Chicago Bulls varsity jacket with snap front and bold embroidered back."],
  ["Eddie Bauer Down Vest", "Eddie Bauer", "Outerwear", "Down", "navy", "Compact down vest with warm quilting and a clean outdoor silhouette."],
  ["Guess Denim Shirt", "Guess", "Shirts", "Denim", "stonewash", "Western-cut denim shirt with pearl snaps and unmistakable acid wash."],
];

const productDescriptions = [
  "Jean recto clásico con lavado auténtico y bajos suavemente gastados.",
  "Capa liviana de fines de los noventa con swoosh bordado y paneles en contraste.",
  "Campera moto de cuero genuino suave, con forro matelaseado y herrajes de bronce envejecido.",
  "Campera deportiva icónica de tres tiras en verde bosque profundo, en excelente estado.",
  "Campera de trabajo resistente con forro tipo manta y lona naturalmente ablandada por el uso.",
  "Polo de piqué suave con bordado original de cocodrilo y calce vintage relajado.",
  "Denim rígido de tiro alto con costuras western en los bolsillos y un lavado oscuro limpio.",
  "Polar técnico y abrigado de la línea ACG, con bolsillos con cierre y ribetes en contraste.",
  "Buzo pesado de reverse weave, con carácter universitario sutil y una pátina especial.",
  "Camisa abotonada atemporal con bordado de pony y una silueta amplia y cómoda.",
  "Campera inflable corta con paneles distintivos y capucha guardable.",
  "Sobrecamisa de lana virgen abrigada, a cuadros tenues y con bolsillos con tapa.",
  "Remera de moto de costura simple, con gráfica de concesionaria suavizada por el sol.",
  "Trench clásico de doble botonadura, con forro a cuadros y hebillas marcadas por el tiempo.",
  "Buzo Synchilla cómodo, con bolsillo en contraste en el pecho y broches al frente.",
  "Campera de denim con forro tipo manta, cuello de corderoy y desgaste auténtico de trabajo.",
  "Buzo minimalista bordado, en jersey de gramaje medio color bordó intenso.",
  "Campera náutica color block, con marca de bandera grande y forro de red.",
  "Pantalón de trabajo resistente de frente liso, con raya definida y pierna recta relajada.",
  "Campera de campo práctica, con cuello de corderoy, bolsillos amplios y forro de franela.",
  "Tejido de tenis con escote en V, vivos a rayas y pequeño logo bordado.",
  "Campera varsity de los Chicago Bulls, con botones a presión y bordado llamativo en la espalda.",
  "Chaleco de pluma compacto, con acolchado cálido y silueta outdoor limpia.",
  "Camisa de denim de corte western, con broches nacarados y lavado ácido inconfundible.",
];

const productImages = [
  "vintage-levis-501", "nike-windbreaker-1998", "wilson-leather-jacket", "adidas-track-jacket-90s",
  "carhartt-work-jacket", "vintage-lacoste-polo", "wrangler-cowboy-jeans", "nike-acg-fleece",
  "vintage-champion-hoodie", "ralph-lauren-oxford", "north-face-nuptse", "pendleton-wool-overshirt",
  "harley-davidson-tee", "burberry-trench-coat", "patagonia-snap-t", "lee-storm-rider",
  "reebok-club-crewneck", "tommy-hilfiger-sailing", "dickies-874-trousers", "ll-bean-field-coat",
  "fila-tennis-sweater", "starter-bulls-jacket", "eddie-bauer-down-vest", "guess-denim-shirt",
];

const sizes = ["XS", "S", "M", "L", "XL"];
const suffixes = ["Archivo", "Lavado", "Heritage", "Original", "Clásico"];
const priceBase: Record<string, number> = { Jackets: 128, Jeans: 82, Tops: 46, Knitwear: 74, Sweatshirts: 68, Shirts: 62, Outerwear: 148, Trousers: 72 };

export const products: Product[] = Array.from({ length: 120 }, (_, index) => {
  const t = productTemplates[index % productTemplates.length];
  const variant = Math.floor(index / productTemplates.length);
  const name = variant === 0 ? t[0] : `${t[0]} · ${suffixes[variant - 1]}`;
  const category = t[2];
  const created = isoAgo(180 - index, 10);
  return {
    id: `prd_${String(index + 1).padStart(4, "0")}`,
    sku: `RLC-${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    name,
    description: productDescriptions[index % productDescriptions.length],
    brand: t[1], category, material: t[3], color: t[4],
    size: sizes[(index * 3) % sizes.length],
    price: priceBase[category] + ((index * 13) % 55),
    stock: index % 13 === 0 ? 0 : (index * 7) % 12 + 1,
    reservedStock: index % 19 === 0 ? 1 : 0,
    image: `/products/photos/${productImages[index % productImages.length]}.webp`,
    createdAt: created, updatedAt: isoAgo(index % 14, 9),
  };
});

const firstNames = ["Sofía", "Mateo", "Valentina", "Julián", "Camila", "Tomás", "Martina", "Felipe", "Lucía", "Santiago", "Emilia", "Franco", "Renata", "Nicolás", "Malena", "Bautista", "Clara", "Agustín"];
const lastNames = ["Ledesma", "Ferreyra", "Quiroga", "Paz", "Roldán", "Méndez", "Acosta", "Navarro", "Sosa", "Peralta", "Romero", "Benítez"];

export const customers: Customer[] = Array.from({ length: 72 }, (_, index) => {
  const first = firstNames[index % firstNames.length];
  const last = lastNames[(index * 5) % lastNames.length];
  const slug = `${first}.${last}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return {
    id: `cus_${String(index + 1).padStart(4, "0")}`,
    name: `${first} ${last}`,
    phone: `+54 11 555${index % 10}-${String(1100 + index * 37).slice(-4)}`,
    email: `${slug}.${index + 1}@example.com`,
    createdAt: isoAgo(420 - index * 4, 11),
  };
});

const paymentMethods = ["card", "transfer", "cash"] as const;
export const sales: Sale[] = Array.from({ length: 248 }, (_, index) => {
  const customer = customers[(index * 7) % customers.length];
  const itemCount = (index % 3) + 1;
  const items = Array.from({ length: itemCount }, (_, itemIndex) => {
    const product = products[(index * 11 + itemIndex * 17) % products.length];
    const quantity = index % 23 === 0 && itemIndex === 0 ? 2 : 1;
    return { id: `sit_${index}_${itemIndex}`, productId: product.id, productName: product.name, quantity, unitPrice: product.price, subtotal: product.price * quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = index % 9 === 0 ? Math.round(subtotal * 0.1) : 0;
  return {
    id: `sal_${String(index + 1).padStart(5, "0")}`,
    number: `#${String(2101 + index).padStart(5, "0")}`,
    customerId: customer.id, customerName: customer.name, items,
    subtotal, discount, total: subtotal - discount,
    paymentMethod: paymentMethods[index % paymentMethods.length],
    status: index % 41 === 0 ? "refunded" : index % 37 === 0 ? "pending" : "completed",
    createdAt: isoAgo(Math.floor(index * 0.52), 9 + (index % 9)),
  };
});

export const movements: StockMovement[] = Array.from({ length: 96 }, (_, index) => {
  const product = products[(index * 7) % products.length];
  const type = index % 8 === 0 ? "purchase" : index % 11 === 0 ? "adjustment" : "sale";
  const quantity = type === "purchase" ? 8 + (index % 5) : type === "sale" ? -1 : index % 2 ? 2 : -2;
  return {
    id: `mov_${String(index + 1).padStart(4, "0")}`, productId: product.id, productName: product.name,
    type, quantity, reason: type === "purchase" ? "Ingreso de lote" : type === "sale" ? "Venta registrada" : "Recuento físico",
    createdAt: isoAgo(index * 0.7, 10 + (index % 8)),
  };
});

export const reservations: Reservation[] = Array.from({ length: 14 }, (_, index) => {
  const customer = customers[(index * 9) % customers.length];
  const product = products[(index * 13 + 2) % products.length];
  const status = index < 7 ? "pending" : index < 10 ? "confirmed" : index < 12 ? "cancelled" : "expired";
  const createdAt = new Date(now.getTime() - index * DAY * 0.6);
  return {
    id: `res_${String(index + 1).padStart(4, "0")}`, code: `RSV-${String(4810 + index)}`,
    customerId: customer.id, customerName: customer.name, productId: product.id, productName: product.name,
    quantity: 1, status, createdAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + 2 * DAY).toISOString(),
  };
});

export const categories = Array.from(new Set(products.map((product) => product.category))).sort();
export const brands = Array.from(new Set(products.map((product) => product.brand))).sort();
