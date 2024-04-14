-- CreateTable
CREATE TABLE "project" (
    "project_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_name" VARCHAR(50),
    "project_description" VARCHAR(255),
    "project_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "use_uuid" UUID,

    CONSTRAINT "project_pkey" PRIMARY KEY ("project_uuid")
);

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
