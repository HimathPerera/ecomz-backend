const authResolver = require("./auth/authResolver");
const itemResolver = require("./item/itemResolver");

const rootResolver = {
  ...authResolver,
  ...itemResolver,
};

module.exports = rootResolver;
