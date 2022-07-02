import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserTemp } from "../../entity/userTemp.entity";
import { User } from "../../entity/user.entity";
import { environment } from "../environment";

///////////REGISTER USER AFTER RECEIVE EMAIL CONFIRMATION/////////////////////

//Query create new user
export const getUserToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    console.log("Token recived");

    //decoded token
    const data: any = verify(token, environment.JWT_SECRET);
    const { code, email } = data;

    console.log(email, code);

    //Check email on database User
    const userExists = await UserTemp.findOne({ where: { code } });

    if (!userExists) {
      const error = new Error();
      error.message = "Something Wrong";
      throw error;
    }

    // Verificar el código
    if (email !== userExists.email) {
      return res.redirect("/error.html");
    }

    //Compare send hours if more than 1 hour is rejected

    const date1: any = new Date();
    const date2: any = new Date(userExists.inicialDate);

    const hours = Math.abs(date1 - date2) / 36e5;

    if (hours > 1) {
      return res.redirect("/error.html");
    }

    //Insert on User table
    const newUser = await User.insert({
      fullName: userExists.fullName,
      email: userExists.email,
      password: userExists.password,
      bookLoan: false,
    });

    //Finding recently email request
    const result = await User.findOneBy({
      id: newUser.identifiers[0].id,
    });
    if (!result) throw new Error("Error");
    console.log(result);

    // Redirect to confirm web
    res.redirect("/confirm.html");

    //res.redirect("/error.html")
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
