const Item = require("../../../models/item.model");
const User = require("../../../models/user.model");
const { userHandle } = require("../helpers/helpers");

module.exports = {
  items: async () => {
    try {
      const itemResult = await Item.find();
      return itemResult.map((item) => {
        return {
          ...item._doc,
          creator: userHandle.bind(this, item._doc.creator),
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  search: async (args) => {
    const obj = JSON.parse(JSON.stringify(args.key.name));
    try {
      // const searchResult = await Item.find({ name: obj });
      // return searchResult;

      const searchResult = await Item.find({
        $or: [{ name: { $regex: obj, $options: "i" } }],
      });
      return searchResult;
    } catch (err) {
      throw err;
    }
  },
  createItems: async (args, req) => {
    const createdItem = new Item({
      name: args.itemInput.name,
      price: +args.itemInput.price,
      description: args.itemInput.description,
      creator: req.userId,
    });

    let admin = req.isAdmin;

    if (admin == true) {
      try {
        let matchingUser = await User.findById(req.userId);
        await matchingUser.createdItems.push(createdItem);
        await matchingUser.save();
      } catch (err) {
        (err) => {
          console.log(err);
          next(err);
        };
      }
      try {
        const ItemSaved = await createdItem.save();
        return {
          ...ItemSaved._doc,
          creator: userHandle.bind(this, ItemSaved._doc.creator),
        };
      } catch (err) {
        console.log(err);
        next(err);
      }
      return createdItem
        .save()
        .then((result) => {
          return {
            ...result._doc,
            creator: userHandle.bind(this, result._doc.creator),
          };
        })
        .catch((err) => {
          throw err;
        });
    } else {
      throw new Error("only admins can add items");
    }
  },

  deleteItem: async (args, req) => {
    let admin = req.isAdmin;

    if (admin == true) {
      try {
        const itemResult = await Item.findById(args.itemId);
        await Item.deleteOne({ _id: args.itemId });
        return itemResult;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("only admins can delete items");
    }
  },
};
