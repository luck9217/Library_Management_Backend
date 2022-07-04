import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Response, Request } from "express";
import { environment } from "../config/environment";

export interface TContext {
  req: Request;
  res: Response;
  payload: { userId: string };
}

export const isAuth: MiddlewareFn<TContext> = ({ context }, next) => {
  try {
    const bearerToken = context.req.headers["authorization"];

    if (!bearerToken) {
      console.log(bearerToken);
      throw new Error("Unauthorized");
    }

    const jwt = bearerToken.split(" ")[1];

    const payload = verify(jwt, environment.JWT_SECRET);
    context.payload = payload as any;

    console.log("message after jwr validation",payload);
  } catch (e: any) {
    console.log(e.message);
    throw new Error(e);
  }

  return next();
};
