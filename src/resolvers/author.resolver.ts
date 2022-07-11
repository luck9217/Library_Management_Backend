import { IsString, Length } from "class-validator";
import {
  Arg,
  Field,
  InputType,
  Resolver,
  Mutation,
  Query,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { MoreThan } from "typeorm";
import { Author } from "../entity/author.entity";
import { isAuth, TContext } from "../middlewares/auth.middleware";

@InputType()
class AuthorInput {
  @Field()
  @Length(3, 64)
  @IsString()
  fullName!: string;
}

@InputType()
class AuthorIdInput {
  @Field(() => Number)
  Id!: number;
}

@InputType()
class AuthorUpdateInput {
  @Field(() => Number)
  id!: number;

  @Field()
  @Length(3, 12)
  fullName?: string;
}

@Resolver()
export class AuthorResolver {
  @Mutation(() => Author)
  @UseMiddleware(isAuth)
  async createAuthor(
    @Arg("input", () => AuthorInput) input: AuthorInput
  ): Promise<Author | undefined> {
    const newAuthor = await Author.insert(input);

    // const result = await Author.findOne({ where: newAuthor.identifiers[0].id });
    const result = await Author.findOneBy({ id: newAuthor.identifiers[0].id });

    console.log(result);
    console.log(newAuthor.identifiers[0].id);

    if (!result) return undefined;

    return result;
  }

  @Query(() => [Author]) // @Field on entity to traslate to field query // [] with bracket i especified an array like response
  @UseMiddleware(isAuth)
  async GetAllAuthorMore10(): Promise<Author[]> {
    //const result = Author.find({ where: [{ id: 5 }] });
    // const result = Author.find({
    //   order: {
    //     id: "DESC",
    //   },
    // });+

    const result = await Author.findBy({
      id: MoreThan(10),
    });

    if (!result) return Author.find();

    return result;
  }

  @Query(() => [Author])
  @UseMiddleware(isAuth)
  async GetAllAuthor(@Ctx() context: TContext): Promise<Author[]> {
    try {
      const result = await Author.find({ relations: ["books"] });

      console.log(result);

      return result;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  @Query(() => [Author]) // @Field on entity to traslate to field query // [] with bracket i especified an array like response
  async GetIdAuthor(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
  ): Promise<Author[]> {
    const result = await Author.find({ where: [{ id: input.Id }] });
    console.log(input.Id);
    console.log(result);

    return result;
  }

  @Mutation(() => Author)
  @UseMiddleware(isAuth)
  async updateOneAuthor(
    @Arg("input", () => AuthorUpdateInput) input: AuthorUpdateInput
  ) {
    //const authorExists = await Author.findOne({ where: [{ id: input.id }] });
    const authorExists = await Author.update(input.id, input);

    if (authorExists.affected === 0) {
      throw new Error("Auhtor does not exists");
    }

    // const updatedAuthor = await Author.save({
    //   id: input.id,
    //   fullName: input.fullName,
    // });

    const updatedAuthor = await Author.update(input.id, input);
    //.save -> return object
    //.update ->return status
    const result = await Author.findOne({ where: [{ id: input.id }] });

    console.log(updatedAuthor);
    console.log(result);

    return result;
  }

  @Mutation(() => Boolean) // @Field on entity to traslate to field query // [] with bracket i especified an array like response
  @UseMiddleware(isAuth)
  async DeleteAuthorId(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput //: Promise<Author[]>
  ) {
    const result = await Author.delete(input.Id);

    if (result.affected === 0) return false;

    console.log(result.affected);

    return true;
  }
}
