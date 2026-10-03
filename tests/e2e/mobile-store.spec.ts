import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content, `overflow horizontal: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport);
}

test("las páginas públicas se adaptan entre 320 y 430 px", async ({ page }) => {
  const routes = ["/", "/products", "/products/prd_0013", "/story", "/checkout"];

  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of routes) {
      await page.goto(route);
      await expectNoHorizontalOverflow(page);
    }
  }
});

test("el menú móvil permite navegar y cerrarse", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");

  await page.getByRole("button", { name: "Abrir menú" }).click();
  const navigation = page.getByRole("navigation", { name: "Navegación móvil" });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Tienda", exact: true }).click();

  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole("heading", { name: "Tienda", exact: true })).toBeVisible();
});

test("buscar, filtrar por talle y ordenar conserva los criterios", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("searchbox", { name: "Buscar en la colección" }).fill("cuero");
  await page.getByRole("combobox", { name: "Filtrar por talle" }).selectOption("M");
  await page.getByRole("combobox", { name: "Ordenar productos" }).selectOption("price-low");
  await page.getByRole("button", { name: "Aplicar" }).click();

  await expect(page).toHaveURL(/q=cuero/);
  await expect(page).toHaveURL(/size=M/);
  await expect(page).toHaveURL(/sort=price-low/);
  await expect(page.locator("article")).toHaveCount(1);
  await expectNoHorizontalOverflow(page);
});

test("una búsqueda sin resultados puede limpiarse", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("searchbox", { name: "Buscar en la colección" }).fill("producto-imposible-xyz");
  await page.getByRole("button", { name: "Aplicar" }).click();

  await expect(page.getByRole("heading", { name: "Esta vez no encontramos nada." })).toBeVisible();
  await page.getByRole("link", { name: "Limpiar filtros" }).click();
  await expect(page).toHaveURL(/\/products$/);
  expect(await page.locator("article").count()).toBeGreaterThan(0);
});

test("el agregado rápido funciona con interacción táctil", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/products");

  const quickAdd = page.getByRole("button", { name: /Agregar rápido/ }).first();
  await expect(quickAdd).toBeVisible();
  await quickAdd.click();

  const cart = page.getByRole("complementary", { name: "Carrito" });
  await expect(cart).toBeVisible();
  await expect(cart).toContainText("Subtotal");
  await expectNoHorizontalOverflow(page);
});

test("el carrito persiste al recargar y permite eliminar", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("button", { name: /Agregar rápido/ }).first().click();
  let cart = page.getByRole("complementary", { name: "Carrito" });
  await cart.getByRole("button", { name: "Cerrar carrito" }).click();

  await page.reload();
  await page.getByRole("button", { name: "Abrir carrito" }).click();
  cart = page.getByRole("complementary", { name: "Carrito" });
  await expect(cart).toContainText("Subtotal");
  await cart.getByRole("button", { name: "Eliminar" }).click();
  await expect(cart).toContainText("Tu carrito está vacío");
});

test("la ficha muestra prenda y modelo, y completa carrito y checkout", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/products/prd_0075");

  const title = page.getByRole("heading", { level: 1 });
  await expect(title).toBeVisible();
  const productName = await title.textContent();
  expect(productName).toBeTruthy();
  await expect(page.getByAltText(new RegExp(`Modelo usando ${productName}`))).toBeVisible();
  const favorite = page.getByRole("button", { name: "Guardar prenda" }).first();
  await favorite.click();
  await expect(page.getByRole("button", { name: "Quitar de favoritos" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  const cart = page.getByRole("complementary", { name: "Carrito" });
  await expect(cart).toBeVisible();
  await cart.getByRole("button", { name: "Sumar una unidad" }).click();
  await expect(cart).toContainText("(2)");
  await cart.getByRole("link", { name: "Finalizar compra" }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel("Email", { exact: true }).fill("qa@relic.example");
  await page.getByLabel("Nombre", { exact: true }).fill("Ana");
  await page.getByLabel("Apellido", { exact: true }).fill("Prueba");
  await page.getByLabel("Dirección", { exact: true }).fill("Calle 123");
  await page.getByLabel("Ciudad", { exact: true }).fill("Buenos Aires");
  await page.getByLabel("Código postal", { exact: true }).fill("1000");
  await page.getByLabel("Teléfono", { exact: true }).fill("1111111111");
  await page.getByLabel("Número de tarjeta", { exact: true }).fill("4242 4242 4242 4242");
  await page.getByLabel("Vencimiento", { exact: true }).fill("12/30");
  await page.getByLabel("CVC", { exact: true }).fill("123");
  await page.getByRole("button", { name: /Confirmar pedido de prueba/ }).click();

  await expect(page.getByRole("heading", { name: "Esta pieza ya es tuya." })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
