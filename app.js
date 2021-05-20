const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");

const GraphQlSchema = require("./graphQl/schema");
const GraphQlResolver = require("./graphQl/resolvers");
const isAuth = require("./middleware/isAuth");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: GraphQlSchema,

    rootValue: GraphQlResolver,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hmakd.mongodb.net/ECOMERCE?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
