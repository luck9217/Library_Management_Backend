import { startServer } from "./server";
import { AppDataSource } from "./config/typeorm";
import userRoutes from "./routers/user.routes";
import express from "express";

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
  //Set static page
  app.use(express.static("./public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  //Routers
  app.use(userRoutes);
  console.log("Router running");

  app.get('/',(req,res)=>{
    res.redirect("https://www.google.com")
  })

  console.log("END");
}

main();
