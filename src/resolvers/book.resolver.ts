import { Length } from "class-validator";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { addDaysToDate } from "../config/dateConvert/dateConvert";
import { environment } from "../config/environment";
import { Author } from "../entity/author.entity";
import { Book } from "../entity/book.entity";
import { User } from "../entity/user.entity";
import { isAuth, TContext } from "../middlewares/auth.middleware";

@InputType()
class BookInput {
  @Field()
  @Length(3, 64)
  title!: string;

  @Field()
  author!: number;
}

@InputType()
class BookIdInput {
  @Field(() => Number)
  id!: number;
}

@InputType()
class BookUpdateInput {
  @Field(() => String, { nullable: true })
  @Length(3, 64)
  title?: string;

  @Field(() => Number, { nullable: true })
  author?: number;
}

@InputType()
class BookUpdateParsedInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Author, { nullable: true })
  author?: Author;
}

@Resolver()
export class BookResolver {
  //////////////// CREATE NEW BOOK WITH JWT /////////////////////////
  @Mutation(() => Book)
  @UseMiddleware(isAuth)
  async createBook(
    @Arg("input", () => BookInput) input: BookInput,
    @Ctx() context: TContext
  ) {
    try {
      console.log("result jwt", context.payload);
      const author = await Author.findOne({ where: [{ id: input.author }] });

      if (!author) {
        const error = new Error();
        error.message =
          "The author for this book does not exist, please double check";
        throw error;
        ////throw new Error("author does not exist")
      }

      const book = await Book.insert({
        title: input.title,
        author: author,
      });

      const result = await Book.findOneBy({ id: book.identifiers[0].id });
      console.log(result);

      return result;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  //////////////QUERY ALL BOOK AVAILABLE WITH JWT //////////////////
  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async getAllBooksAvailable(): Promise<Book[] | undefined> {
    const result = await Book.find({
      relations: ["author", "author.books"],
      where: { isOnLoan: false },
    });
    console.log(result);
    return result;
  }

  //////////////QUERY ALL BOOK NOT AVAILABLE WITH JWT //////////////////
  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async getDateOnLean(): Promise<Book[] | undefined> {
    const result = await Book.find({
      relations: ["author", "author.books"],
      where: { isOnLoan: true },
    });
    console.log(result);
    return result;
  }

  ////////////// MUTATION TAKE NEW BOOK AVAILABLE ///////////
  @Mutation(() => Book)
  @UseMiddleware(isAuth)
  async userOnleanBook(
    @Arg("input", () => BookIdInput) input: BookIdInput,
    @Ctx() context: TContext
  ) {
    try {
      //Finding book
      const bookSelected = await Book.findOne({ where: { id: input.id } });

      if (!bookSelected) {
        const error = new Error();
        error.message = "The Book does not exist, please double check";
        throw error;
      }

      //Cheking available
      if (bookSelected.isOnLoan === true) {
        const error = new Error();
        error.message = "The Book does not available";
        throw error;
      }

      const dataUserLog: any = context.payload;
      console.log("The user log is ", dataUserLog.id);

      //Findign user Log
      const userLog = await User.findOne({
        where: { id: dataUserLog.id },
        relations: ["books"],
      });

      if (!userLog) {
        const error = new Error();
        error.message = "The User does not exist, please double check";
        throw error;
      }

      //checking amount of books loaned
      if (userLog.books.length >= Number(environment.BOOKS_LOAN)) {
        const error = new Error();
        error.message = "The User is overload to books, please book back";
        throw error;
      }

      //Mark bookLoan on user selected
      const resultUpdate = await User.update(userLog.id, { bookLoan: true });
      console.log(resultUpdate);

      //Update book with new user owner
      const dateNow: any = new Date();
      const dateEnd: any = addDaysToDate(dateNow, Number(environment.DAY_LOAN));

      const result = await Book.update(input.id, {
        isOnLoan: true,
        userOwner: userLog,
        DateLoan: dateNow,
        DateBackLoan: dateEnd,
      });

      if (result.affected === 0) {
        const error = new Error();
        error.message = "Something wrong to upload";
        throw error;
      }

      return bookSelected;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  //////////// QUERY GET ALL BOOK WITH JWT ////////////
  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async getAllBooks(): Promise<Book[] | undefined> {
    const result = await Book.find({ relations: ["author", "author.books"] });
    console.log(result);
    return result;
  }

  @Query(() => Book)
  async getBookById(
    @Arg("input", () => BookIdInput) input: BookIdInput // : Promise<Book | undefined>
  ): Promise<Book | undefined> {
    try {
      const book = await Book.findOne({
        where: {
          id: input.id,
        },
        relations: ["author", "author.books"],
      });

      if (!book) {
        const error = new Error();
        error.message =
          "The author for this book does not exist, please double check";
        throw error;
      }

      console.log(book);

      return book;
    } catch (error) {
      console.log(error);
      //throw new Error(error);
    }
  }

  @Mutation(() => Boolean)
  async updateBookById(
    @Arg("bookId", () => BookIdInput) bookId: BookIdInput,
    @Arg("input", () => BookUpdateInput) input: BookUpdateInput
  ) {
    const convertInput = await this.parseInput(input);
    const result = await Book.update(bookId.id, convertInput);

    if (result.affected === 0) {
      throw new Error("This book does not exist");
    }

    console.log(result);
    console.log(convertInput);

    return true;
  }

  //Function to convert Id.Book.Author.Number to Author
  private async parseInput(input: BookUpdateInput) {
    const _input: BookUpdateParsedInput = {};

    if (input.title) {
      _input["title"] = input.title;
    }

    if (input.author) {
      const author = await Author.findOne({ where: [{ id: input.author }] });
      if (!author) {
        throw new Error("This author does not exist");
      }
      _input["author"] = author;
    }
    return _input;
  }

  @Mutation(() => Boolean)
  async deleteBook(
    @Arg("bookId", () => BookIdInput) bookId: BookIdInput //: Promise<Boolean>
  ) {
    try {
      const result = await Book.delete(bookId.id);

      if (result.affected === 0) {
        const error = new Error();
        error.message = "Book does not exist";
        throw error;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
