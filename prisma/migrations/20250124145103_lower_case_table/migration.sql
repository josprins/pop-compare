-- CreateTable
CREATE TABLE "country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iso_code" TEXT NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "population_data" (
    "id" SERIAL NOT NULL,
    "country_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "population" INTEGER NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "population_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_data" (
    "id" SERIAL NOT NULL,
    "comparison_id" INTEGER NOT NULL,
    "population_data_id" INTEGER NOT NULL,

    CONSTRAINT "comparison_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_iso_code_key" ON "country"("iso_code");

-- AddForeignKey
ALTER TABLE "population_data" ADD CONSTRAINT "population_data_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_data" ADD CONSTRAINT "comparison_data_comparison_id_fkey" FOREIGN KEY ("comparison_id") REFERENCES "comparison"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_data" ADD CONSTRAINT "comparison_data_population_data_id_fkey" FOREIGN KEY ("population_data_id") REFERENCES "population_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
