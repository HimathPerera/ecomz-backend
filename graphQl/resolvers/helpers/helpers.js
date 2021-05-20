const User = require("../../../models/user.model");
const Item = require("../../../models/item.model");

//try catch block not working(found the bug)
const itemHandle = async (itemIds) => {
  try {
    const itemResult = await Item.find({ _id: { $in: itemIds } });
    return itemResult.map((item) => {
      return {
        ...item._doc,
        creator: userHandle.bind(this, item._doc.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const userHandle = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdItems: itemHandle.bind(this, user._doc.createdItems),
    };
  } catch (err) {
    throw err;
  }
};

// const itemHandle = (eventIds) => {
//   return Item.find({ _id: { $in: eventIds } })
//     .then((items) => {
//       return items.map((item) => {
//         return {
//           ...item._doc,
//           creator: userHandle.bind(this, item._doc.creator),
//         };
//       });
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// const userHandle = (userId) => {
//   return User.findById(userId)
//     .then((user) => {
//       return {
//         ...user._doc,
//         createdItems: itemHandle.bind(this, user._doc.createdItems),
//       };
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

exports.itemHandle = itemHandle;
exports.userHandle = userHandle;
