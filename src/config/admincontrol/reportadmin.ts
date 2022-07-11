import { LessThan } from "typeorm";
import { Book } from "../../entity/book.entity";
import {
  getTemplateOk,
  getTemplateTable,
  sendEmail,
} from "../email/mail.config";
import { environment } from "../environment";

export const sendReportAdmin = async () => {
  try {
    const emailAdmin = String(environment.EMAIL_TEST);

    const dateNow = new Date().toISOString();

    const bookInfraction = await Book.find({
      relations: { userOwner: true, author: true },
      where: {
        isOnLoan: true,
        DateBackLoan: LessThan(dateNow),
      },
      select: {
        author: { fullName: true },
        userOwner: { fullName: true, email: true },
      },
    });

    if (!bookInfraction) {
      //send template without book pending

      //Building template
      const bodyTemplate = getTemplateOk();

      //Send Email
      await sendEmail(emailAdmin, "Semanal Report - Admin", bodyTemplate);
    }

    //saving data to send to report
    interface DataInfo {
      titleBook: string;
      dateBack: string;
      nameUser: string;
      authorBook: string;
      emailUser: string;
    }

    let totalData: DataInfo[] = [];

    bookInfraction.map((book) => {
      let cellData = {
        titleBook: book.title,
        dateBack: book.DateBackLoan,
        nameUser: book.userOwner.fullName,
        authorBook: book.author.fullName,
        emailUser: book.userOwner.email,
      };
      totalData.push(cellData);
    });

    let titles = "";
    //constructing titles of table
    Object.keys(totalData[0]).map((title) => {
      titles += `<th>${title}</th>`;
    });
    titles = `<tr>${titles}</tr>`;

    let dataCell = "";
    //constructing titles of table

    Object.values(totalData).map((allField) => {
      let dataCellTemp = "";
      Object.values(allField).map((data) => {
        dataCellTemp += `<td>${data}</td>`;
      });
      dataCellTemp = `<tr>${dataCellTemp}</tr>`;

      dataCell += dataCellTemp;
    });

    //Building template
    const bodyTemplate = getTemplateTable(titles, dataCell);

    //Send Email
    await sendEmail(emailAdmin, "Semanal Report - Admin", bodyTemplate);

    return console.log("build info and sent it");
  } catch (error: any) {
    throw new Error(error);
  }
};
