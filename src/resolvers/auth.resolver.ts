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
import { UserTemp } from "../entity/userTemp.entity";
import { verify } from "jsonwebtoken";
import { uuid } from "uuidv4";
import { getTemplatePassNew, sendEmail } from "../config/email/mail.config";
import { getTemplateConfirm } from "../config/email/mail.config";

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
  /////////////////////// PRE-REGISTER MUTATION ////////////////////////////
  @Mutation(() => String)
  async preRegister(@Arg("input", () => UserInput) input: UserInput) {
    try {
      const { fullName, email, password } = input;

      //Check email on database User
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        const error = new Error();
        error.message = "Email is not available";
        throw error;
      }

      const hashedPassword = await hash(password, 10);

      //Insert on temp table
      const newUser = await UserTemp.insert({
        fullName,
        email,
        password: hashedPassword,
        code: uuid(),
      });

      //Finding recently email request
      const result = await UserTemp.findOneBy({
        id: newUser.identifiers[0].id,
      });
      if (!result) throw new Error("Error");
      console.log(result);

      const resultResponde = "Sending email to confirmation";
      console.log(resultResponde);

      //token creator
      const jwt: string = sign(
        { code: result.code, email: result.email },
        environment.JWT_SECRET
      );
      console.log(jwt);

      //Sending Email
      const bodyTemplate = getTemplateConfirm(result.fullName, jwt);

      await sendEmail(result.email, "Confirm Your Account", bodyTemplate);

      return resultResponde;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  //////////// QUERY REQUEST NEW PASSWORD ////////////

  @Mutation(() => String)
  async newPassUser(@Arg("input", () => LoginInput) input: LoginInput) {
    try {
      const { email, password } = input;

      //Check email on database User
      const userExists = await User.findOne({ where: { email: email } });

      if (!userExists) {
        const error = new Error();
        error.message = "Email is not founded";
        throw error;
      }

      const hashedPassword = await hash(password, 10);

      const resultResponde = "Sending email to confirmation";
      console.log(resultResponde);

      //token creator
      const jwt: string = sign(
        { code: hashedPassword, email: userExists.email },
        environment.JWT_SECRET
      );

      //Sending Email
      const bodyTemplate = getTemplatePassNew(userExists.fullName, jwt);

      await sendEmail(userExists.email, "Change Password", bodyTemplate);

      return resultResponde;
    } catch (error: any) {
      throw new Error(error);
    }
  }

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
