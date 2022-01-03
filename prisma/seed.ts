import { PrismaClient } from "@prisma/client";
import { auth } from "services/auth.service";
const prisma = new PrismaClient();

async function main() {
  const user = await auth.createUser("admin@admin.com", "admin");
  console.log("user created", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
