import { Between, LessThan, Like, MoreThan } from "typeorm";
import { Author } from "../../entity/author.entity";
import { Book } from "../../entity/book.entity";
import { User } from "../../entity/user.entity";

export const userRecordatory = async () => {
  try {
    const dateNow = new Date().toISOString();

    const UsersInfraction = await User.find({
      relations: { books: true },
      where: {
        bookLoan: true,
        books: {
          DateBackLoan: LessThan(dateNow),
        },
      },
      select: {
        books: {
          id: true,
          title: true,
          DateBackLoan: true,
        },
      },
    });

    //create list of author with id
    const authorId = await Author.find({
      select: { id: true, fullName: true },
    });

    const listAuthor: any = {};

    authorId.map((author) => {
      listAuthor[author.id] = author.fullName;
    });

    //create list of book with id author book.id|autor.id
    const bookId = await Book.find({
      relations: { author: true },
      select: { id: true, author: { id: true } },
    });

    const listIdBookAuthor: any = {};

    bookId.map((book) => {
      listIdBookAuthor[book.id] = book.author.id;
    });

    //show data resume
    UsersInfraction.forEach((dataUser) => {
      console.log("User: ", dataUser.fullName, " | Email: ", dataUser.email);
      dataUser.books.forEach((book) => {
        console.log(
          book.title,
          " book of ",
          listAuthor[listIdBookAuthor[book.id]]
        );
      });
    });
  } catch (error) {
    console.log(error);
  }

  return console.log("Hello World");
};
