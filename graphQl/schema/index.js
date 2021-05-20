const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Item{
  _id: ID!
  name: String!
  price: Float!
  description: String!
  creator:User!
}
type ItemMini{
  _id: ID!
  name: String!
  price: Float!
  description: String!
}
type User{
  _id:ID!
  email: String!
  createdItems:[Item!]
  token: String!
  isAdmin:Boolean!
}
type AuthData{
userId:ID!
token: String!
tokenExpiration :Int!
isAdmin:Boolean!
email:String!
}

input ItemInput{
  name: String!
  price: Float!
  description: String!
}
input UserInput{
  email:String!
  password:String!
}
input SearchInput{
  name: String!
}

type RootQuery{
  items:[Item!]!
  search(key:SearchInput):[Item!]!
  login(email:String! , password :String!):AuthData!
},
type RootMutation{
  createItems(itemInput:ItemInput):Item
  createUser(userInput:UserInput):User
  deleteItem(itemId:ID!):ItemMini
}

schema{
  query:RootQuery
  mutation:RootMutation
}
`);
