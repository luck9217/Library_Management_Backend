import { compareSync, hash } from "bcryptjs";
import { IsEmail, Length } from "class-validator";
import { sign } from "jsonwebtoken";
import { environment } from "../config/environment";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entity/user.entity";
import { verify } from "jsonwebtoken";

@InputType()
class UserInput {
  @Field()
  @Length(3, 64)
  fullName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(8, 254)
  password!: string;
}
@InputType()
class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
class LoginResponse {
  @Field()
  userId!: number;

  @Field()
  jwt!: string;
}

@Resolver()
export class AuthResolver {
  /////////////////////// REGISTER MUTATION ////////////////////////////
  @Mutation(() => User)
  async register(@Arg("input", () => UserInput) input: UserInput) {
    try {
      const { fullName, email, password } = input;

      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        const error = new Error();
        error.message = "Email is not available";
        throw error;
      }

      const hashedPassword = await hash(password, 10);

      const newUser = await User.insert({
        fullName,
        email,
        password: hashedPassword,
      });

      const result = await User.findOneBy({ id: newUser.identifiers[0].id });
      console.log(result);
      console.log(newUser);
      console.log(newUser.identifiers[0].id);

      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /////////////////////// LOGIN MUTATION ////////////////////////////
  @Mutation(() => LoginResponse)
  async login(@Arg("input", () => LoginInput) input: LoginInput) {
    try {
      const { email, password } = input;

      const userFound = await User.findOne({ where: { email } });

      if (!userFound) {
        const error = new Error();
        error.message = "Invalid credentials";
        throw error;
      }

      const isValidPasswd: boolean = compareSync(password, userFound.password);

      if (!isValidPasswd) {
        const error = new Error();
        error.message = "Invalid credentials";
        throw error;
      }

      const jwt: string = sign({ id: userFound.id }, environment.JWT_SECRET);
      console.log(jwt);

      const payload = verify(jwt, environment.JWT_SECRET);
      console.log(environment.JWT_SECRET);
      console.log("result de verify", payload);

      return {
        userId: userFound.id,
        jwt: jwt,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
