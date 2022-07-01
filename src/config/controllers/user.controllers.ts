import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserTemp } from "../../entity/userTemp.entity";
import { User } from "../../entity/user.entity";
import { environment } from "../environment";

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

    console.log("usario a insertar ", userExists);

    // Redirect to confirm web
    res.redirect("/confirm.html");

    //res.redirect("/error.html")
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
