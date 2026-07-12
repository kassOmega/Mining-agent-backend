import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // -------------------------------------------------------------
  // 1. CLEAR OLD DATA (Safe to run multiple times)
  // -------------------------------------------------------------
  console.log("Clearing old data...");
  await prisma.siteDocument.deleteMany();
  await prisma.site.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();
  await prisma.kebele.deleteMany();
  await prisma.woreda.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.siteType.deleteMany(); // ✅ Added clean
  await prisma.mineralType.deleteMany(); // ✅ Added clean

  // -------------------------------------------------------------
  // 2. SEED DYNAMIC METADATA RECORDS
  // -------------------------------------------------------------
  console.log("Seeding dynamic metadata models...");

  const siteTypesInput = [
    { name: "ALLUVIAL", label: "Alluvial Scale" },
    { name: "HARD_ROCK", label: "Hard Rock Scale" },
    { name: "ELUVIAL", label: "Eluvial Scale" },
    { name: "ARTISANAL", label: "Artisanal Mining" },
    { name: "SMALL_SCALE", label: "Small Scale Mining" },
    { name: "LARGE_SCALE", label: "Large Scale Mining" },
    { name: "EXPLORATION", label: "Exploration Phase" },
  ];

  const mineralTypesInput = [
    { name: "GOLD", label: "Gold" },
    { name: "TANTALUM", label: "Tantalum" },
    { name: "MARBLE", label: "Marble" },
    { name: "GEMS", label: "Gemstones" },
    { name: "COAL", label: "Coal" },
    { name: "LITHIUM", label: "Lithium" },
    { name: "OTHER", label: "Other Minerals" },
  ];

  const siteTypeMap: Record<string, string> = {};
  for (const st of siteTypesInput) {
    const record = await prisma.siteType.create({ data: st });
    siteTypeMap[st.name] = record.id;
  }

  const mineralTypeMap: Record<string, string> = {};
  for (const mt of mineralTypesInput) {
    const record = await prisma.mineralType.create({ data: mt });
    mineralTypeMap[mt.name] = record.id;
  }

  // -------------------------------------------------------------
  // 3. CREATE GEOGRAPHIC LOCATIONS
  // -------------------------------------------------------------
  console.log("Creating locations...");
  const zones = [
    {
      name: "Asosa",
      woredas: [
        {
          name: "Asosa Town",
          kebeles: ["Kebele 01", "Kebele 02", "Kebele 03", "Kebele 04"],
        },
        { name: "Kormuk", kebeles: ["Kormuk 01", "Kormuk 02", "Kormuk 03"] },
        {
          name: "Sherkole",
          kebeles: ["Sherkole 01", "Sherkole 02", "Sherkole 03", "Sherkole 04"],
        },
        { name: "Manga", kebeles: ["Manga 01", "Manga 02", "Manga 03"] },
      ],
    },
    {
      name: "Kamashi",
      woredas: [
        {
          name: "Kamashi Town",
          kebeles: ["Kebele 01", "Kebele 02", "Kebele 03"],
        },
        { name: "Begi", kebeles: ["Begi 01", "Begi 02", "Begi 03"] },
        { name: "Yaso", kebeles: ["Yaso 01", "Yaso 02"] },
      ],
    },
    {
      name: "Metekel",
      woredas: [
        {
          name: "Gilgel Beles",
          kebeles: [
            "Kebele 01",
            "Kebele 02",
            "Kebele 03",
            "Kebele 04",
            "Kebele 05",
          ],
        },
        { name: "Dangur", kebeles: ["Dangur 01", "Dangur 02", "Dangur 03"] },
        { name: "Dibate", kebeles: ["Dibate 01", "Dibate 02", "Dibate 03"] },
        { name: "Bulen", kebeles: ["Bulen 01", "Bulen 02", "Bulen 03"] },
        {
          name: "Wenbera",
          kebeles: ["Wenbera 01", "Wenbera 02", "Wenbera 03"],
        },
      ],
    },
    {
      name: "Assosa",
      woredas: [
        {
          name: "Bambasi",
          kebeles: ["Bambasi 01", "Bambasi 02", "Bambasi 03"],
        },
        {
          name: "Odabu-Gambiela",
          kebeles: ["Odabu 01", "Odabu 02", "Gambiela 01"],
        },
      ],
    },
  ];

  for (const zoneData of zones) {
    const zone = await prisma.zone.create({ data: { name: zoneData.name } });
    for (const woredaData of zoneData.woredas) {
      const woreda = await prisma.woreda.create({
        data: { name: woredaData.name, zoneId: zone.id },
      });
      for (const kebeleName of woredaData.kebeles) {
        await prisma.kebele.create({
          data: { name: kebeleName, woredaId: woreda.id },
        });
      }
    }
  }

  // -------------------------------------------------------------
  // 4. CREATE USERS
  // -------------------------------------------------------------
  console.log("Creating users...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      passwordHash: adminPassword,
      fullName: "System Admin",
      phone: "+251911000000",
      role: "ADMIN",
      isActive: true,
      subscription: {
        create: {
          plan: "PREMIUM",
          status: "ACTIVE",
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  const brokerPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "test@gmail.com",
      passwordHash: brokerPassword,
      fullName: "Test Broker",
      phone: "+251913000000",
      role: "CLIENT",
      isActive: true,
      subscription: {
        create: {
          plan: "FREE",
          status: "ACTIVE",
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  const modPassword = await bcrypt.hash("kass1234", 10);
  await prisma.user.create({
    data: {
      email: "kass3me@gmail.com",
      passwordHash: modPassword,
      fullName: "Site Moderator",
      phone: "+251912000000",
      role: "MODERATOR",
      isActive: true,
      subscription: {
        create: {
          plan: "PREMIUM",
          status: "ACTIVE",
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  // -------------------------------------------------------------
  // 5. FETCH KEBELES FOR SITES
  // -------------------------------------------------------------
  const asosaKebele01 = await prisma.kebele.findFirst({
    where: { name: "Kebele 01", woreda: { name: "Asosa Town" } },
  });
  const sherkoleKebele02 = await prisma.kebele.findFirst({
    where: { name: "Sherkole 02", woreda: { name: "Sherkole" } },
  });
  const dangurKebele01 = await prisma.kebele.findFirst({
    where: { name: "Dangur 01", woreda: { name: "Dangur" } },
  });

  // -------------------------------------------------------------
  // 6. CREATE DEMO SITES WITH LINKED METADATA ID RELATIONS
  // -------------------------------------------------------------
  console.log("Creating demo sites...");

  if (asosaKebele01) {
    await prisma.site.create({
      data: {
        userId: admin.id,
        kebeleId: asosaKebele01.id,
        title: "Abebe Bekele",
        description:
          "Rich alluvial gold deposit near the river bank. Easily accessible by road.",
        siteTypeId: siteTypeMap["ALLUVIAL"],
        mineralTypeId: mineralTypeMap["GOLD"],
        areaSize: 5.5,
        pictures: JSON.stringify([]),
        googleMapsLink: "https://maps.google.com/?q=Asosa,Ethiopia",
        status: "VERIFIED",
        isFeatured: true,
        verifiedAt: new Date(),
        verifiedBy: admin.id,
        isPublished: true,
      },
    });
  }

  if (sherkoleKebele02) {
    await prisma.site.create({
      data: {
        userId: admin.id,
        kebeleId: sherkoleKebele02.id,
        title: "Tadesse Hailu",
        description:
          "Hard rock gold vein exposed on hillside. Requires drilling equipment.",
        siteTypeId: siteTypeMap["HARD_ROCK"],
        mineralTypeId: mineralTypeMap["GOLD"],
        areaSize: 12,
        pictures: JSON.stringify([]),
        googleMapsLink: "https://maps.google.com/?q=Sherkole,Ethiopia",
        status: "VERIFIED",
        isFeatured: false,
        verifiedAt: new Date(),
        verifiedBy: admin.id,
        isPublished: true,
      },
    });
  }

  if (dangurKebele01) {
    await prisma.site.create({
      data: {
        userId: admin.id,
        kebeleId: dangurKebele01.id,
        title: "Hassan Omar",
        description:
          "Newly discovered site. Initial tests show high tantalum traces.",
        siteTypeId: siteTypeMap["ELUVIAL"],
        mineralTypeId: mineralTypeMap["TANTALUM"],
        areaSize: 8,
        pictures: JSON.stringify([]),
        status: "PENDING",
        isPublished: false,
      },
    });
  }

  console.log("\n=========================================");
  console.log("Database seeded successfully!");
  console.log("=========================================");
}

main()
  .catch((e) => {
    console.error("SEEDING FAILED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
