import { startServer } from "./server";
import { AppDataSource } from "./config/typeorm";
import { sendEmail } from "./config/email/mail.config";

import { Template } from "./config/email/mail.config";

import nodemailer from "nodemailer";
import { environment } from "../src/config/environment";

async function main() {
  //database on postgres
  await AppDataSource.initialize();
  console.log("Database Connected");
  const port: number = 4000;
  //server graph ql
  const app = await startServer();
  //Localhost
  app.listen(port);
  console.log("App running on port", port);

  const bodyTemplate= Template("Lucas","aca va token");

  await sendEmail("vaheh86213@weepm.com","Test template",bodyTemplate);
 

  console.log("FIN");
}

main();
