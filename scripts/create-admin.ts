import { PrismaClient } from "@prisma/client";
import prompt from "prompt";
import { auth } from "services/auth.service";

prompt.start();

prompt.get(["email", "password"], async (err, res) => {
  if (err) {
    console.log(err);
    return 1;
  }
  console.log("Command-line input received:");
  console.log("  Email: " + res.email);

  const db = new PrismaClient();
  await auth.createUser(res.email as string, res.password as string);
  console.log("done");
});
