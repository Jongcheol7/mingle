/*
  Warnings:

  - You are about to drop the column `isDirect` on the `ChatRoomMember` table. All the data in the column will be lost.
  - Added the required column `isDirect` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "isDirect" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ChatRoomMember" DROP COLUMN "isDirect";
