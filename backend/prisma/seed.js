// prisma/seed.js
const prisma = require("./prisma-client");
const inspectorIds = ["201234567"];
async function main() {
  // Inspectors
  await prisma.inspector.create({
    data: {
      inspectorId: inspectorIds[0],
      fullName: "Itzik Itzik",
      email: "itzik@gmail.com",
      phoneNumber: "0541234567",
      employeeId: "EMP001",
      password: "$2a$12$T0N8PLuwa767BtpKyrLfVOhQQigo7GUKaoNkXYVJaYgpIGMWXV7Mm", //asd
      inspectorType: "Chief",
      isActive: true,
    },
  });
  await prisma.region.createMany({
    data: [
      { regionId: "1", name: "North", code: "NR" },
      { regionId: "2", name: "Center", code: "CTR" },
      { regionId: "3", name: "South", code: "STH" },
    ],
  });
  // Products
  await prisma.product.createMany({
    data: [
      {
        productId: "P001",
        name: "Otis Model X",
        productFamily: "Elevator",
      },
      {
        productId: "P002",
        name: "Schindler Lift 3000",
        productFamily: "Lift",
      },
    ],
  });

  // Addresses
  await prisma.address.create({
    data: {
      addressId: "A001",
      addressType: "Street",
      city: 101,
      street: 202,
      houseNumber: 10,
      houseEntrance: 1,
      zipcode: 12345,
      geoLocationLatitude: 32.0853,
      geoLocationLongitude: 34.7818,
      block: 5,
      plot: 20,
    },
  });

  // AccountSiteOwner
  await prisma.siteOwner.create({
    data: {
      siteOwnerId: "SO001",
      name: "City Real Estate",
      identityType: "PrivateCompany",
      businessId: "123456789",
      phoneNumber: "0501234567",
      email: "cre@gmail.com",
    },
  });

  // AccountAssetOwner
  await prisma.assetOwner.create({
    data: {
      assetOwnerId: "AO001",
      name: "Mega Property Holdings",
      identityType: "PrivateCompany",
      phoneNumber: "0517654321",
      businessId: "987654321",
    },
  });

  // Sites
  await prisma.site.create({
    data: {
      siteId: "S001",
      addressId: "A001",
      siteOwnerId: "SO001",
      siteType: "Residential",
      designation: "Residential",
      officeSerialNumber: "RS-1001",
      regionId: "2",
    },
  });

  // Assets
  await prisma.asset.create({
    data: {
      assetId: "AS001",
      productId: "P001",
      siteId: "S001",
      assetOwnerId: "AO001",
      name: "Elevator Tower 1",
      installDate: new Date("2020-01-01"),
      assetPurpose: "PassengerElevator",
      serialNumber: "SN-001",
      officeSerialNumber: "OF-001",
      status: "Active",
      marking: "MK-01",
      ownerType: "Company",
      manufactureDate: new Date("2019-06-01"),
      engineNumber: "ENG-01",
      cellDoorType: "AutoCenter",
      shaftDoorType: "Auto",
      numberOfDoors: 2,
      description: "Main building elevator",
      usageEndDate: new Date("2030-01-01"),
      numberOfStations: 10,
      metersHeight: 30.5,
      weight: 500,
      maxPassengers: 8,
      isLifting: true,
      liftingDate: new Date("2020-01-02"),
    },
  });

  // AccountReviewer
  await prisma.reviewer.create({
    data: {
      reviewerId: "R001",
      fullName: "David Levi",
      phoneNumber: "0521122334",
      email: "david@example.com",
      identityType: "AuthorizedDealer",
      idNumber: "111111111",
      isActive: true,
      certificateNumber: "123",
      certificationExpiry: new Date("2026-01-01"),
    },
  });

  // Review
  await prisma.review.createMany({
    data: [
      {
        reviewId: "RV001",
        assetId: "AS001",
        reviewerId: "R001",
        reviewDate: new Date("2024-01-01"),
        assetSystemSource: "Internal",
        reviewReason: "RoutineCheck",
        reviewerNumber: "REV-100",
        reviewerDecision: "Operateable",
        originalDocumentPath: "RV001.pdf",
        totalRedeemDays: 30,
        maxWeightAllowed: 500,
        maxPassengers: 8,
        summary: "All systems functional",
        processingStatus: "Completed",
      },
      {
        reviewId: "RV002",
        assetId: "AS001",
        reviewerId: "R001",
        reviewDate: new Date("2023-06-01"),
        assetSystemSource: "Internal",
        reviewReason: "PostFixCheck",
        reviewerNumber: "REV-101",
        reviewerDecision: "Disable",
        totalRedeemDays: 30,
        maxWeightAllowed: 500,
        originalDocumentPath: "RV001.pdf",
        maxPassengers: 8,
        summary: "Fixed minor issues",
        processingStatus: "Completed",
      },
    ],
  });

  // ReviewInstruction
  await prisma.reviewInstruction.create({
    data: {
      instructionId: "RI001",
      reviewId: "RV001",
      productInstruction: "Check motor lubrication",
      numberOfDaysToPursue: 7,
    },
  });

  // ReviewAssembly
  await prisma.reviewAssembly.create({
    data: {
      assemblyId: "RA001",
      reviewId: "RV001",
      assemblySubject: "Cabin",
      assemblyStatus: "OK",
      assemblyNotes: "No issues found",
    },
  });

  // ReviewDefect
  await prisma.reviewDefect.create({
    data: {
      defectId: "RD001",
      reviewId: "RV001",
      assemblySubject: "Door",
      subjectFinding: "Loose hinge",
      defectDescription: "Needs tightening",
      severity: "Medium",
      isResolved: false,
      resolvedDate: new Date("2024-02-01"),
    },
  });

  // Orders
  await prisma.safetyOrder.createMany({
    data: [
      {
        orderId: "O001",
        orderNumber: "001",
        reviewId: "RV001",
        assetId: "AS001",
        inspectorId: inspectorIds[0],
        orderType: "Approve",
        orderContent: "Re-inspect after fixes",
        issueDate: new Date("2023-06-05"),
        dueDate: new Date("2023-07-01"),
        status: "Open",
        isActive: true,
      },
      {
        orderId: "O002",
        orderNumber: "002",
        reviewId: "RV002",
        assetId: "AS001",
        inspectorId: inspectorIds[0],
        orderType: "Fix",
        orderContent: "Check motor function",
        issueDate: new Date("2023-06-10"),
        dueDate: new Date("2023-07-10"),
        status: "InProgress",
        isActive: true,
      },
    ],
  });
  await prisma.alert.createMany({
    data: [
      {
        alertId: "A0001",
        inspectorId: inspectorIds[0],
        title: "Failed Scan",
        alertType: "ScanningProblem",
        description: "an inspection failed to scan",
        status: "Open",
        priority: "Important",
        dueDate: new Date("2025-09-26"),
      },
      {
        alertId: "A0002",
        inspectorId: inspectorIds[0],
        title: "Torn Cable",
        description: "The elevator crushed because the cable is torn",
        alertType: "Danger",
        status: "Open",
        priority: "Critical",
        dueDate: new Date("2025-09-27"),
      },
    ],
  });
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
