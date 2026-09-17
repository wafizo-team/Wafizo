-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('NOT_CONNECTED', 'CONNECTED', 'SYNC_ERROR');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "address" TEXT,
ADD COLUMN     "connectionStatus" "ConnectionStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
ADD COLUMN     "googleLocationId" TEXT,
ADD COLUMN     "lastSyncAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "GoogleTokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleTokens_userId_key" ON "GoogleTokens"("userId");

-- AddForeignKey
ALTER TABLE "GoogleTokens" ADD CONSTRAINT "GoogleTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
