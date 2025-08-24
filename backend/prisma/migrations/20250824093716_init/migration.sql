-- CreateEnum
CREATE TYPE "InspectorType" AS ENUM ('Chief', 'Regional');

-- CreateEnum
CREATE TYPE "ProductFamily" AS ENUM ('Elevator', 'Lift');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('Street', 'Plot', 'Coordinates');

-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('Residential', 'Industrial', 'Construction', 'Services', 'Government');

-- CreateEnum
CREATE TYPE "SiteDesignation" AS ENUM ('Residential', 'Hotel', 'Hospital', 'Government', 'Industrial', 'ShoppingCenter', 'Mall');

-- CreateEnum
CREATE TYPE "identityType" AS ENUM ('AuthorizedDealer', 'Association', 'PrivateCompany');

-- CreateEnum
CREATE TYPE "AssetPurpose" AS ENUM ('PassengerElevator', 'FrightList', 'Service', 'Construction', 'Other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Disabled');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('Company', 'HouseComnittee', 'PrivatePerson');

-- CreateEnum
CREATE TYPE "CellDoorType" AS ENUM ('Wing', 'AutoCenter', 'AutoRight', 'AutoLeft', 'VerticalMaunal', 'VerticalAuto', 'HorizontalAuto', 'None');

-- CreateEnum
CREATE TYPE "ShaftDoorType" AS ENUM ('Auto', 'Wing', 'Other');

-- CreateEnum
CREATE TYPE "ReviewReason" AS ENUM ('RoutineCheck', 'FirstCheck', 'PostFixCheck', 'PostRecall', 'Elevation', 'DrasticChange');

-- CreateEnum
CREATE TYPE "ReviewerDecision" AS ENUM ('Operateable', 'Disable');

-- CreateEnum
CREATE TYPE "AssemblyStatus" AS ENUM ('OK', 'NotOk', 'NotChecked');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Disable', 'Fix', 'Approve');

-- CreateTable
CREATE TABLE "Inspector" (
    "inspectorId" VARCHAR(9) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "password" TEXT NOT NULL,
    "inspectorType" "InspectorType" NOT NULL,
    "region" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspector_pkey" PRIMARY KEY ("inspectorId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productFamily" "ProductFamily" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressId" TEXT NOT NULL,
    "addressType" "AddressType" NOT NULL,
    "city" INTEGER,
    "street" INTEGER,
    "houseNumber" INTEGER NOT NULL,
    "houseEntrance" INTEGER NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "geoLocationLatitude" DECIMAL(65,30),
    "geoLocationLongitude" DECIMAL(65,30),
    "block" INTEGER,
    "plot" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "Site" (
    "siteId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "siteAccountId" TEXT NOT NULL,
    "siteType" "SiteType" NOT NULL,
    "designation" "SiteDesignation" NOT NULL,
    "officialSerialNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("siteId")
);

-- CreateTable
CREATE TABLE "AccountSiteOwner" (
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identityType" "identityType" NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountSiteOwner_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "AccountAssetOwner" (
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identityType" "identityType" NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountAssetOwner_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Asset" (
    "assetId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "assetOwnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "installDate" TIMESTAMP(3) NOT NULL,
    "assetPurpose" "AssetPurpose" NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "officeSerialNumber" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "marking" TEXT NOT NULL,
    "ownerType" "OwnerType" NOT NULL,
    "manufactureDate" TIMESTAMP(3) NOT NULL,
    "engineNumber" TEXT NOT NULL,
    "cellDoorType" "CellDoorType" NOT NULL,
    "shaftDoorType" "ShaftDoorType" NOT NULL,
    "numberOfDoors" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "usageEndDate" TIMESTAMP(3) NOT NULL,
    "numberOfStations" INTEGER NOT NULL,
    "metersHeight" DECIMAL(65,30) NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "maxPassengers" INTEGER NOT NULL,
    "isLifting" BOOLEAN NOT NULL,
    "liftingDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("assetId")
);

-- CreateTable
CREATE TABLE "AccountReviewer" (
    "accountId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "identityType" INTEGER NOT NULL,
    "idNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "certificationExpiry" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountReviewer_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Review" (
    "reviewId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "technicianId" TEXT,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "assetSystemSource" TEXT NOT NULL,
    "reviewReason" "ReviewReason" NOT NULL,
    "reviewerNumber" TEXT NOT NULL,
    "reviewerDecision" "ReviewerDecision" NOT NULL,
    "totalRedeemDays" INTEGER NOT NULL,
    "maxWeightAllowed" DECIMAL(65,30) NOT NULL,
    "maxPassengers" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL,
    "processingStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "ReviewInstruction" (
    "instructionId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "productInstruction" TEXT NOT NULL,
    "numberOfDaysToPursue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewInstruction_pkey" PRIMARY KEY ("instructionId")
);

-- CreateTable
CREATE TABLE "ReviewAssembly" (
    "assemblyId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "assemblyStatus" "AssemblyStatus" NOT NULL,
    "assemblyNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewAssembly_pkey" PRIMARY KEY ("assemblyId")
);

-- CreateTable
CREATE TABLE "ReviewDefect" (
    "defectId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "subjectFinding" TEXT NOT NULL,
    "defectDescription" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "isResolved" BOOLEAN NOT NULL,
    "resolvedDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewDefect_pkey" PRIMARY KEY ("defectId")
);

-- CreateTable
CREATE TABLE "Orders" (
    "orderId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "orderContent" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inspector_email_key" ON "Inspector"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inspector_phoneNumber_key" ON "Inspector"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_siteAccountId_fkey" FOREIGN KEY ("siteAccountId") REFERENCES "AccountSiteOwner"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("siteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetOwnerId_fkey" FOREIGN KEY ("assetOwnerId") REFERENCES "AccountAssetOwner"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "AccountReviewer"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewInstruction" ADD CONSTRAINT "ReviewInstruction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAssembly" ADD CONSTRAINT "ReviewAssembly_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewDefect" ADD CONSTRAINT "ReviewDefect_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "Inspector"("inspectorId") ON DELETE RESTRICT ON UPDATE CASCADE;
