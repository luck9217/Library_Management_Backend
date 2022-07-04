import { startServer } from "./server";
import { AppDataSource } from "./config/typeorm";
import userRoutes from "./routers/user.routes";
import express from "express";
import { environment } from "./config/environment";

async function main() {
  //database on postgres
  await AppDataSource.initialize();
  console.log("Database Connected");
  const port: number = Number(environment.PORT);
  //server graph ql
  const app = await startServer();
  //Localhost
  app.listen(port);
  console.log("App running on port", port);
  //Set static page
  app.use(express.static("./public"));
  //Routers
  app.use(userRoutes);
  console.log("Router running");

  console.log("END");
}

main();
