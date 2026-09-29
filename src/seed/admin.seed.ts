import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma.js";

const admin = {
  email: "talk2muhammedawwal@gmail.com",
  name: "Musa Muhammed Awwal",
  password: "Musa@1234",
};

const adminSeed = async () => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: admin.email,
      },
    });

    if (existingAdmin) {
      console.log(`Admin already exists: ${admin.email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(
      admin.password,
      12,
    );

    const createdAdmin = await prisma.user.create({
      data: {
        email: admin.email,
        name: admin.name,
        password: hashedPassword,
        role: "SYSTEM_ADMIN",
      },
    });

    console.log("Admin created successfully:");
    console.log({
      id: createdAdmin.id,
      email: createdAdmin.email,
      name: createdAdmin.name,
    });
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

adminSeed();