const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // 1. Seed default Admin if not exists
  const adminEmail = process.env.ADMIN_EMAIL || "admin@upsc.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    console.log(`Created default admin account: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  // 2. Seed Answer Keys
  const keysOfficial = [];
  const keysVision = [];
  
  for (let i = 1; i <= 100; i++) {
    // Official Key
    keysOfficial.push({
      institute: "Official",
      paperType: "GS",
      set: "A",
      questionNum: i,
      answer: i % 4 === 0 ? "D" : i % 3 === 0 ? "C" : i % 2 === 0 ? "B" : "A",
    });

    // VisionIAS Key (slightly different)
    keysVision.push({
      institute: "VisionIAS",
      paperType: "GS",
      set: "A",
      questionNum: i,
      answer: i % 5 === 0 ? "A" : i % 3 === 0 ? "C" : i % 2 === 0 ? "B" : "A",
    });
  }

  await prisma.answerKey.deleteMany();
  await prisma.answerKey.createMany({ data: [...keysOfficial, ...keysVision] });
  console.log("Seeded Answer Keys for GS Set A (Official & VisionIAS)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
