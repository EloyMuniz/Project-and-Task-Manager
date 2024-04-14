-- CreateTable
CREATE TABLE "task" (
    "task_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "task_title" VARCHAR(50),
    "task_description" VARCHAR(255),
    "task_date_conclude" TEXT NOT NULL,
    "task_concluded" BOOLEAN NOT NULL,
    "task_excluded" BOOLEAN NOT NULL,
    "project_uuid" UUID,

    CONSTRAINT "task_pkey" PRIMARY KEY ("task_uuid")
);

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_uuid_fkey" FOREIGN KEY ("project_uuid") REFERENCES "project"("project_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
