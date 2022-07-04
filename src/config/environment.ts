import dotenv from "dotenv";

dotenv.config();

export const environment = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET || "Default",

  EMAIL_TEST: process.env.EMAIL_TEST,
  Email_TEST_PASS: process.env.Email_TEST_PASS,

  DAY_LOAN :process.env.DAY_LOAN,
  BOOKS_LOAN : process.env.BOOKS_LOAN,
};
