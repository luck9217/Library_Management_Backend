import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { BookResolver } from "./resolvers/book.resolver";
import { AuthorResolver } from "./resolvers/author.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";

export async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BookResolver, AuthorResolver, AuthResolver],
    }),
    context: ({ req, res }: any) => ({ req, res }),
  });
  //solve problem with packed apollo server and calling listen
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  return app;
}
