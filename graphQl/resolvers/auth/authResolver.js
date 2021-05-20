const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../../models/user.model");

module.exports = {
  createUser: async (args) => {
    let exsistingUser;
    try {
      exsistingUser = await User.findOne({ email: args.userInput.email });
    } catch (err) {
      throw new Error("user found try logging");
    }
    if (!exsistingUser) {
      var hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      } catch (err) {
        throw new Error("server error");
      }
      const createdUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
        isAdmin: false,
      });
      try {
        const user = await createdUser.save();
        const token = jwt.sign(
          { userId: user._id, isAdmin: user.isAdmin, email: user.email },
          "STARKINDUSTRIESISINTOP",
          { expiresIn: "1h" }
        );
        return {
          _id: user._id,
          email: user.email,
          createdItems: user.createdItems,
          token,
          isAdmin: user.isAdmin,
        };
      } catch (err) {
        throw new Error("user creating failed");
      }
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user does not exsits");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("password is incorrect");
    }
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin, email: user.email },
      "STARKINDUSTRIESISINTOP",
      { expiresIn: "1h" }
    );
    return {
      userId: user._id,
      token,
      tokenExpiration: 1,
      isAdmin: user.isAdmin,
      email: user.email,
    };
  },
};
