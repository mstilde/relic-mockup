import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const categoryTranslations: Record<string, string> = {
  Jackets: "Camperas", Jeans: "Jeans", Tops: "Remeras y polos", Knitwear: "Tejidos",
  Sweatshirts: "Buzos", Shirts: "Camisas", Outerwear: "Abrigos", Trousers: "Pantalones",
};

const colorTranslations: Record<string, string> = {
  blue: "azul", navy: "azul marino", black: "negro", green: "verde", brown: "marrón",
  cream: "crudo", indigo: "índigo", purple: "violeta", grey: "gris", white: "blanco",
  red: "rojo", plaid: "a cuadros", beige: "beige", teal: "verde azulado", burgundy: "bordó",
  yellow: "amarillo", charcoal: "gris carbón", olive: "oliva", stonewash: "lavado a la piedra",
};

const materialTranslations: Record<string, string> = {
  Denim: "Denim", Nylon: "Nylon", Leather: "Cuero", Polyester: "Poliéster", "Cotton duck": "Lona de algodón",
  "Cotton piqué": "Piqué de algodón", "Cotton piquÃ©": "Piqué de algodón", Fleece: "Polar", Cotton: "Algodón", "Oxford cotton": "Algodón Oxford",
  Ripstop: "Ripstop", Wool: "Lana", Gabardine: "Gabardina", Twill: "Gabardina sarga", Canvas: "Lona",
  "Cotton knit": "Tejido de algodón", Down: "Pluma",
};

export function categoryLabel(value: string) { return categoryTranslations[value] ?? value; }
export function colorLabel(value: string) { return colorTranslations[value.toLowerCase()] ?? value; }
export function materialLabel(value: string) { return materialTranslations[value] ?? value; }

export function shortDate(value: string | Date) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function dateTime(value: string | Date) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function initials(name: string) {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("");
}
