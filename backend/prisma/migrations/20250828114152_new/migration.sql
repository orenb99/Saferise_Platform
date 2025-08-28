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
CREATE TYPE "IdentityType" AS ENUM ('AuthorizedDealer', 'Association', 'PrivateCompany');

-- CreateEnum
CREATE TYPE "AssetOwnerIdentityType" AS ENUM ('AuthorizedDealer', 'Association', 'PrivateCompany', 'HouseCommittee');

-- CreateEnum
CREATE TYPE "AssetPurpose" AS ENUM ('PassengerElevator', 'FrightList', 'Service', 'Construction', 'Other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Disabled');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('Company', 'HouseCommittee', 'PrivatePerson');

-- CreateEnum
CREATE TYPE "CellDoorType" AS ENUM ('Wing', 'AutoCenter', 'AutoRight', 'AutoLeft', 'VerticalManual', 'VerticalAuto', 'HorizontalAuto', 'None');

-- CreateEnum
CREATE TYPE "ShaftDoorType" AS ENUM ('Auto', 'Wing', 'Other');

-- CreateEnum
CREATE TYPE "ReviewSeverityLevel" AS ENUM ('OK', 'Minor', 'Medium', 'Critical');

-- CreateEnum
CREATE TYPE "ReviewProcessingStatus" AS ENUM ('Pending', 'InProgress', 'Completed', 'Error');

-- CreateEnum
CREATE TYPE "ReviewReason" AS ENUM ('RoutineCheck', 'FirstCheck', 'PostFixCheck', 'PostRecall', 'Elevation', 'DrasticChange');

-- CreateEnum
CREATE TYPE "ReviewerDecision" AS ENUM ('Operateable', 'Disable');

-- CreateEnum
CREATE TYPE "AssemblyStatus" AS ENUM ('OK', 'NotOk', 'NotChecked');

-- CreateEnum
CREATE TYPE "DefectSeverityLevel" AS ENUM ('Minor', 'Medium', 'Critical');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Disable', 'Fix', 'Approve');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Open', 'InProgress', 'Expired', 'Closed');

-- CreateEnum
CREATE TYPE "AlertPriority" AS ENUM ('Critical', 'Important', 'Medium', 'Information');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('Danger', 'SevereDefect', 'InspectionDue', 'ScanningProblem', 'Notification');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('Open', 'InProgress', 'Resolved', 'Rejected');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('Status', 'ElevatorNoReview', 'InspectorPerformance', 'SafetyTrends', 'Orders', 'Custom');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'Excel', 'PowerPoint');

-- CreateEnum
CREATE TYPE "QueueProcessingStatus" AS ENUM ('WaitingOCR', 'InProgress', 'AIProcessing', 'Completed', 'Error');

-- CreateTable
CREATE TABLE "Inspector" (
    "inspectorId" VARCHAR(9) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "password" TEXT NOT NULL,
    "employeeId" VARCHAR(20) NOT NULL,
    "inspectorType" "InspectorType" NOT NULL,
    "regionId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspector_pkey" PRIMARY KEY ("inspectorId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" VARCHAR(18) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "productFamily" "ProductFamily" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Region" (
    "regionId" VARCHAR(18) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("regionId")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressId" VARCHAR(18) NOT NULL,
    "addressType" "AddressType" NOT NULL,
    "city" INTEGER,
    "street" INTEGER,
    "houseNumber" INTEGER NOT NULL,
    "houseEntrance" INTEGER NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "geoLocationLatitude" DECIMAL(10,8),
    "geoLocationLongitude" DECIMAL(10,8),
    "block" INTEGER,
    "plot" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "Site" (
    "siteId" VARCHAR(18) NOT NULL,
    "addressId" VARCHAR(18) NOT NULL,
    "siteOwnerId" VARCHAR(18) NOT NULL,
    "regionId" VARCHAR(18) NOT NULL,
    "siteType" "SiteType" NOT NULL,
    "designation" "SiteDesignation" NOT NULL,
    "officeSerialNumber" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("siteId")
);

-- CreateTable
CREATE TABLE "SiteOwner" (
    "siteOwnerId" VARCHAR(18) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "identityType" "IdentityType" NOT NULL,
    "businessId" VARCHAR(20) NOT NULL,
    "phoneNumber" VARCHAR(20),
    "email" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteOwner_pkey" PRIMARY KEY ("siteOwnerId")
);

-- CreateTable
CREATE TABLE "AssetOwner" (
    "assetOwnerId" VARCHAR(18) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "identityType" "AssetOwnerIdentityType" NOT NULL,
    "businessId" VARCHAR(20) NOT NULL,
    "phoneNumber" VARCHAR(20),
    "email" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetOwner_pkey" PRIMARY KEY ("assetOwnerId")
);

-- CreateTable
CREATE TABLE "ServiceCompany" (
    "serviceCompanyId" VARCHAR(18) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "businessId" VARCHAR(20) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "licenseExpiry" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCompany_pkey" PRIMARY KEY ("serviceCompanyId")
);

-- CreateTable
CREATE TABLE "Reviewer" (
    "reviewerId" VARCHAR(18) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "identityType" "IdentityType" NOT NULL,
    "idNumber" VARCHAR(9),
    "certificateNumber" VARCHAR(50) NOT NULL,
    "certificationExpiry" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviewer_pkey" PRIMARY KEY ("reviewerId")
);

-- CreateTable
CREATE TABLE "Asset" (
    "assetId" VARCHAR(18) NOT NULL,
    "productId" VARCHAR(18) NOT NULL,
    "siteId" VARCHAR(18) NOT NULL,
    "assetOwnerId" VARCHAR(18) NOT NULL,
    "serviceCompanyId" VARCHAR(18),
    "name" VARCHAR(255) NOT NULL,
    "installDate" DATE,
    "assetPurpose" "AssetPurpose" NOT NULL,
    "serialNumber" VARCHAR(50) NOT NULL,
    "officeSerialNumber" VARCHAR(50),
    "status" "Status" NOT NULL DEFAULT 'Active',
    "marking" VARCHAR(100),
    "ownerType" "OwnerType" NOT NULL,
    "manufactureDate" DATE,
    "engineNumber" VARCHAR(100) NOT NULL,
    "cellDoorType" "CellDoorType" NOT NULL,
    "shaftDoorType" "ShaftDoorType" NOT NULL,
    "numberOfDoors" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "usageEndDate" DATE,
    "numberOfStations" INTEGER NOT NULL,
    "metersHeight" DECIMAL(8,2) NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL,
    "maxPassengers" INTEGER NOT NULL,
    "isLifting" BOOLEAN NOT NULL DEFAULT false,
    "liftingDate" DATE,
    "lastInspectionDate" DATE,
    "nextInspectionDue" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("assetId")
);

-- CreateTable
CREATE TABLE "Review" (
    "reviewId" VARCHAR(18) NOT NULL,
    "assetId" VARCHAR(18) NOT NULL,
    "reviewerId" VARCHAR(18) NOT NULL,
    "assignedInspectorId" VARCHAR(18),
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "assetSystemSource" VARCHAR(100) NOT NULL,
    "reviewReason" "ReviewReason" NOT NULL,
    "reviewerNumber" VARCHAR(100) NOT NULL,
    "reviewerDecision" "ReviewerDecision" NOT NULL,
    "totalRedeemDays" INTEGER,
    "maxWeightAllowed" DECIMAL(10,2),
    "maxPassengers" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "processingStatus" "ReviewProcessingStatus" NOT NULL DEFAULT 'Pending',
    "processedDate" TIMESTAMP(3),
    "severityLevel" "ReviewSeverityLevel" NOT NULL DEFAULT 'OK',
    "requiresOrder" BOOLEAN NOT NULL DEFAULT false,
    "processingError" TEXT,
    "originalDocumentPath" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "ReviewInstruction" (
    "instructionId" VARCHAR(18) NOT NULL,
    "reviewId" VARCHAR(18) NOT NULL,
    "productInstruction" VARCHAR(500) NOT NULL,
    "numberOfDaysToPursue" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewInstruction_pkey" PRIMARY KEY ("instructionId")
);

-- CreateTable
CREATE TABLE "ReviewAssembly" (
    "assemblyId" VARCHAR(18) NOT NULL,
    "reviewId" VARCHAR(18) NOT NULL,
    "assemblySubject" VARCHAR(200) NOT NULL,
    "assemblyStatus" "AssemblyStatus" NOT NULL,
    "assemblyNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewAssembly_pkey" PRIMARY KEY ("assemblyId")
);

-- CreateTable
CREATE TABLE "ReviewDefect" (
    "defectId" VARCHAR(18) NOT NULL,
    "reviewId" VARCHAR(18) NOT NULL,
    "assemblySubject" VARCHAR(200) NOT NULL,
    "subjectFinding" VARCHAR(200) NOT NULL,
    "defectDescription" TEXT,
    "severity" "DefectSeverityLevel" NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewDefect_pkey" PRIMARY KEY ("defectId")
);

-- CreateTable
CREATE TABLE "SafetyOrder" (
    "orderId" VARCHAR(18) NOT NULL,
    "reviewId" VARCHAR(18) NOT NULL,
    "assetId" VARCHAR(18) NOT NULL,
    "inspectorId" VARCHAR(18) NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "orderNumber" VARCHAR(50) NOT NULL,
    "orderContent" TEXT NOT NULL,
    "issueDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATE,
    "status" "OrderStatus" NOT NULL DEFAULT 'Open',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "complianceNotes" TEXT,
    "complianceDate" TIMESTAMP(3),
    "complianceProof" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafetyOrder_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "Alert" (
    "alertId" VARCHAR(18) NOT NULL,
    "assetId" VARCHAR(18),
    "reviewId" VARCHAR(18),
    "safetyOrderId" VARCHAR(18),
    "inspectorId" VARCHAR(18) NOT NULL,
    "alertType" "AlertType" NOT NULL,
    "priority" "AlertPriority" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "AlertStatus" NOT NULL DEFAULT 'Open',
    "resolvedDate" TIMESTAMP(3),
    "resolvedBy" VARCHAR(18),
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("alertId")
);

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "templateId" VARCHAR(18) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "reportType" "ReportType" NOT NULL,
    "queryDefinition" TEXT NOT NULL,
    "filterDefinition" TEXT,
    "chartDefinition" TEXT,
    "createdBy" VARCHAR(18) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("templateId")
);

-- CreateTable
CREATE TABLE "SavedReport" (
    "reportId" VARCHAR(18) NOT NULL,
    "templateId" VARCHAR(18) NOT NULL,
    "generatedBy" VARCHAR(18) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "parameters" TEXT,
    "generatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" VARCHAR(500) NOT NULL,
    "fileType" "FileType" NOT NULL,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "scheduleDefinition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "AssetSummary" (
    "summaryId" VARCHAR(18) NOT NULL,
    "assetId" VARCHAR(18) NOT NULL,
    "regionId" VARCHAR(18) NOT NULL,
    "summaryDate" DATE NOT NULL,
    "totalInspections" INTEGER NOT NULL DEFAULT 0,
    "criticalDefects" INTEGER NOT NULL DEFAULT 0,
    "minorDefects" INTEGER NOT NULL DEFAULT 0,
    "ordersIssued" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetSummary_pkey" PRIMARY KEY ("summaryId")
);

-- CreateTable
CREATE TABLE "DashboardMetrics" (
    "metricId" VARCHAR(18) NOT NULL,
    "regionId" VARCHAR(18),
    "newReviewsToday" INTEGER NOT NULL DEFAULT 0,
    "activeElevators" INTEGER NOT NULL DEFAULT 0,
    "disabledElevators" INTEGER NOT NULL DEFAULT 0,
    "underMaintenance" INTEGER NOT NULL DEFAULT 0,
    "expiredInspections" INTEGER NOT NULL DEFAULT 0,
    "criticalAlerts" INTEGER NOT NULL DEFAULT 0,
    "pendingOrders" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardMetrics_pkey" PRIMARY KEY ("metricId")
);

-- CreateTable
CREATE TABLE "ProcessingQueue" (
    "queueId" VARCHAR(18) NOT NULL,
    "emailId" VARCHAR(100) NOT NULL,
    "emailSubject" VARCHAR(500),
    "emailSender" VARCHAR(255) NOT NULL,
    "emailReceived" TIMESTAMP(3) NOT NULL,
    "attachmentName" VARCHAR(255),
    "attachmentPath" VARCHAR(500),
    "processingStatus" "QueueProcessingStatus" NOT NULL DEFAULT 'WaitingOCR',
    "reviewId" VARCHAR(18),
    "processingStarted" TIMESTAMP(3),
    "processingCompleted" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessingQueue_pkey" PRIMARY KEY ("queueId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inspector_email_key" ON "Inspector"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inspector_phoneNumber_key" ON "Inspector"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Inspector_employeeId_key" ON "Inspector"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AssetOwner_businessId_key" ON "AssetOwner"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCompany_businessId_key" ON "ServiceCompany"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Reviewer_email_key" ON "Reviewer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reviewer_certificateNumber_key" ON "Reviewer"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_serialNumber_key" ON "Asset"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyOrder_orderNumber_key" ON "SafetyOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AssetSummary_assetId_summaryDate_key" ON "AssetSummary"("assetId", "summaryDate");

-- AddForeignKey
ALTER TABLE "Inspector" ADD CONSTRAINT "Inspector_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("regionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_siteOwnerId_fkey" FOREIGN KEY ("siteOwnerId") REFERENCES "SiteOwner"("siteOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("regionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("siteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetOwnerId_fkey" FOREIGN KEY ("assetOwnerId") REFERENCES "AssetOwner"("assetOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_serviceCompanyId_fkey" FOREIGN KEY ("serviceCompanyId") REFERENCES "ServiceCompany"("serviceCompanyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Reviewer"("reviewerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewInstruction" ADD CONSTRAINT "ReviewInstruction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAssembly" ADD CONSTRAINT "ReviewAssembly_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewDefect" ADD CONSTRAINT "ReviewDefect_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyOrder" ADD CONSTRAINT "SafetyOrder_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "Inspector"("inspectorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyOrder" ADD CONSTRAINT "SafetyOrder_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyOrder" ADD CONSTRAINT "SafetyOrder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "Inspector"("inspectorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_safetyOrderId_fkey" FOREIGN KEY ("safetyOrderId") REFERENCES "SafetyOrder"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReport" ADD CONSTRAINT "SavedReport_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ReportTemplate"("templateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReport" ADD CONSTRAINT "SavedReport_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "Inspector"("inspectorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetSummary" ADD CONSTRAINT "AssetSummary_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetSummary" ADD CONSTRAINT "AssetSummary_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("regionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardMetrics" ADD CONSTRAINT "DashboardMetrics_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("regionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingQueue" ADD CONSTRAINT "ProcessingQueue_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("reviewId") ON DELETE SET NULL ON UPDATE CASCADE;
