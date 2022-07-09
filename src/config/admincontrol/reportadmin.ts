import { LessThan } from "typeorm";
import { Book } from "../../entity/book.entity";
import { getTemplateTable } from "../email/mail.config";

export const buildInfo = async () => {
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

  const listIdBookAuthor: any = {};
  let titleTable: any = [];
  interface DataInfo {
    titleBook: string;
    dateBack: string;
    nameUser: string;
    authorBook: string;
    emailUser: string;
  }

  let totalData: DataInfo[] = [];

  bookInfraction.map((book, index) => {
    listIdBookAuthor[index] = book.title;

    let cellData = {
      titleBook: book.title,
      dateBack: book.DateBackLoan,
      nameUser: book.userOwner.fullName,
      authorBook: book.author.fullName,
      emailUser: book.userOwner.email,
    };
    totalData.push(cellData);
  });

  console.log(totalData);

  //getTemplateTable()

  return console.log(bookInfraction, listIdBookAuthor);
};
