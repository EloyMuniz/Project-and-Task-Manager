-- AlterTable
ALTER TABLE "task" ALTER COLUMN "task_date_conclude" DROP NOT NULL,
ALTER COLUMN "task_concluded" DROP NOT NULL,
ALTER COLUMN "task_excluded" DROP NOT NULL;
