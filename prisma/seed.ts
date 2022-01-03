import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { AuthService } from "../src/services/auth.service";
const auth = new AuthService(prisma);

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
