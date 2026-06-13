-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT,
    "mrp" DECIMAL(10,2) NOT NULL,
    "image_url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "green_credits" INTEGER NOT NULL DEFAULT 0,
    "green_tier" TEXT NOT NULL DEFAULT 'SEEDLING',
    "nearest_dc_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_centers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'WAREHOUSE',

    CONSTRAINT "delivery_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dc_routes" (
    "id" TEXT NOT NULL,
    "source_dc_id" TEXT NOT NULL,
    "dest_dc_id" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "transfer_cost" DECIMAL(10,2) NOT NULL,
    "estimated_days" INTEGER NOT NULL,

    CONSTRAINT "dc_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DELIVERED',
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "returns" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INITIATED',
    "return_method" TEXT,
    "refund_amount" DECIMAL(10,2),
    "current_dc_id" TEXT,
    "route_decision" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_images" (
    "id" TEXT NOT NULL,
    "return_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_gradings" (
    "id" TEXT NOT NULL,
    "return_id" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "confidence" DECIMAL(5,2) NOT NULL,
    "condition_summary" TEXT,
    "defects_found" JSONB,
    "missing_parts" JSONB,
    "functional_notes" TEXT,
    "estimated_resale_value" DECIMAL(10,2),
    "grade_discount_pct" INTEGER NOT NULL,
    "route_decision" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_gradings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "return_id" TEXT,
    "product_id" TEXT NOT NULL,
    "current_dc_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "grade" TEXT NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "selling_price" DECIMAL(10,2) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'RETURN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_orders" (
    "id" TEXT NOT NULL,
    "inventory_item_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "selling_price" DECIMAL(10,2) NOT NULL,
    "shipping_cost" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketplace_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_configs" (
    "id" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "discount_pct" INTEGER NOT NULL,
    "default_route" TEXT NOT NULL,
    "min_mrp" DECIMAL(10,2),

    CONSTRAINT "grade_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "green_credit_ledger" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "reference_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "green_credit_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dc_routes_source_dc_id_dest_dc_id_key" ON "dc_routes"("source_dc_id", "dest_dc_id");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "orders_product_id_idx" ON "orders"("product_id");

-- CreateIndex
CREATE INDEX "returns_user_id_idx" ON "returns"("user_id");

-- CreateIndex
CREATE INDEX "returns_order_id_idx" ON "returns"("order_id");

-- CreateIndex
CREATE INDEX "returns_status_idx" ON "returns"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ai_gradings_return_id_key" ON "ai_gradings"("return_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_return_id_key" ON "inventory_items"("return_id");

-- CreateIndex
CREATE INDEX "inventory_items_status_idx" ON "inventory_items"("status");

-- CreateIndex
CREATE INDEX "inventory_items_current_dc_id_idx" ON "inventory_items"("current_dc_id");

-- CreateIndex
CREATE INDEX "inventory_items_grade_idx" ON "inventory_items"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_orders_inventory_item_id_key" ON "marketplace_orders"("inventory_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "grade_configs_grade_key" ON "grade_configs"("grade");

-- CreateIndex
CREATE INDEX "green_credit_ledger_user_id_idx" ON "green_credit_ledger"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_nearest_dc_id_fkey" FOREIGN KEY ("nearest_dc_id") REFERENCES "delivery_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dc_routes" ADD CONSTRAINT "dc_routes_source_dc_id_fkey" FOREIGN KEY ("source_dc_id") REFERENCES "delivery_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dc_routes" ADD CONSTRAINT "dc_routes_dest_dc_id_fkey" FOREIGN KEY ("dest_dc_id") REFERENCES "delivery_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_current_dc_id_fkey" FOREIGN KEY ("current_dc_id") REFERENCES "delivery_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_images" ADD CONSTRAINT "return_images_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "returns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_gradings" ADD CONSTRAINT "ai_gradings_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "returns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "returns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_current_dc_id_fkey" FOREIGN KEY ("current_dc_id") REFERENCES "delivery_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_orders" ADD CONSTRAINT "marketplace_orders_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_orders" ADD CONSTRAINT "marketplace_orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "green_credit_ledger" ADD CONSTRAINT "green_credit_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
