-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TripTaskCategory" DROP CONSTRAINT "TripTaskCategory_tripId_fkey";

-- AddForeignKey
ALTER TABLE "TripTaskCategory" ADD CONSTRAINT "TripTaskCategory_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TripTaskCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
