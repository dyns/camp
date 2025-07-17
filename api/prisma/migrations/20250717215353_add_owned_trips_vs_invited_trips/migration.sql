/*
  Warnings:

  - You are about to drop the `_TripToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TripToUser" DROP CONSTRAINT "_TripToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TripToUser" DROP CONSTRAINT "_TripToUser_B_fkey";

-- DropTable
DROP TABLE "_TripToUser";

-- CreateTable
CREATE TABLE "_TripOwners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TripOwners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_InvitedTrips" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_InvitedTrips_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TripOwners_B_index" ON "_TripOwners"("B");

-- CreateIndex
CREATE INDEX "_InvitedTrips_B_index" ON "_InvitedTrips"("B");

-- AddForeignKey
ALTER TABLE "_TripOwners" ADD CONSTRAINT "_TripOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripOwners" ADD CONSTRAINT "_TripOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitedTrips" ADD CONSTRAINT "_InvitedTrips_A_fkey" FOREIGN KEY ("A") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitedTrips" ADD CONSTRAINT "_InvitedTrips_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
