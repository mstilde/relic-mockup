CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'transfer', 'card');
CREATE TYPE "SaleStatus" AS ENUM ('completed', 'refunded', 'pending');
CREATE TYPE "StockMovementType" AS ENUM ('purchase', 'sale', 'adjustment', 'reservation', 'release');
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');

CREATE TABLE "Category" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Product" (
  "id" TEXT NOT NULL, "sku" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT NOT NULL,
  "brand" TEXT NOT NULL, "size" TEXT NOT NULL, "color" TEXT NOT NULL, "material" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL, "stock" INTEGER NOT NULL DEFAULT 0, "reservedStock" INTEGER NOT NULL DEFAULT 0,
  "image" TEXT, "categoryId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Customer" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "phone" TEXT NOT NULL, "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Sale" (
  "id" TEXT NOT NULL, "number" TEXT NOT NULL, "customerId" TEXT NOT NULL,
  "subtotal" DECIMAL(10,2) NOT NULL, "discount" DECIMAL(10,2) NOT NULL DEFAULT 0, "total" DECIMAL(10,2) NOT NULL,
  "paymentMethod" "PaymentMethod" NOT NULL, "status" "SaleStatus" NOT NULL DEFAULT 'completed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "SaleItem" (
  "id" TEXT NOT NULL, "saleId" TEXT NOT NULL, "productId" TEXT NOT NULL, "quantity" INTEGER NOT NULL,
  "unitPrice" DECIMAL(10,2) NOT NULL, "subtotal" DECIMAL(10,2) NOT NULL,
  CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StockMovement" (
  "id" TEXT NOT NULL, "productId" TEXT NOT NULL, "type" "StockMovementType" NOT NULL,
  "quantity" INTEGER NOT NULL, "reason" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Reservation" (
  "id" TEXT NOT NULL, "code" TEXT NOT NULL, "customerId" TEXT NOT NULL, "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL, "status" "ReservationStatus" NOT NULL DEFAULT 'pending', "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_name_idx" ON "Product"("name");
CREATE INDEX "Product_brand_idx" ON "Product"("brand");
CREATE INDEX "Product_categoryId_size_idx" ON "Product"("categoryId", "size");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE INDEX "Customer_name_idx" ON "Customer"("name");
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");
CREATE UNIQUE INDEX "Sale_number_key" ON "Sale"("number");
CREATE INDEX "Sale_customerId_idx" ON "Sale"("customerId");
CREATE INDEX "Sale_createdAt_idx" ON "Sale"("createdAt");
CREATE INDEX "Sale_status_idx" ON "Sale"("status");
CREATE INDEX "SaleItem_saleId_idx" ON "SaleItem"("saleId");
CREATE INDEX "SaleItem_productId_idx" ON "SaleItem"("productId");
CREATE INDEX "StockMovement_productId_createdAt_idx" ON "StockMovement"("productId", "createdAt");
CREATE UNIQUE INDEX "Reservation_code_key" ON "Reservation"("code");
CREATE INDEX "Reservation_customerId_idx" ON "Reservation"("customerId");
CREATE INDEX "Reservation_productId_idx" ON "Reservation"("productId");
CREATE INDEX "Reservation_status_expiresAt_idx" ON "Reservation"("status", "expiresAt");

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
