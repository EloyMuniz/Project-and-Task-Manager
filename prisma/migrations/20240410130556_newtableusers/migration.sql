-- CreateTable
CREATE TABLE "users" (
    "use_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "use_email" VARCHAR(50),
    "use_password" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("use_uuid")
);
