// const DB_Handler=required(")
const {User} = require("../Model/splitwise-Model");

const JWT = require("../Utlities/util");
exports.Signup = async (data) => {
  const login = new User({
    email: data.email,
    Password: data.Password,
    mobileNumber: data.mobileNumber,
    balance: data.balance,
    name: data.name,
  });
  login
    .save()
    .then(() => {
      console.log("User created");
      return { status: "Data is save" };
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

exports.login = async (data) => {
  try {
    let sendata = {};
    sendata.info = await User.findOne({
      $and: [{ email: data.email }, { Password: data.Password }],
    });
    if (sendata.info) {
      sendata.token = await JWT.GenrateToken(data.email_id);
      sendata.Status = "Authorise Sucess";
      return sendata;
    } else {
      return (sendata.Status = "Unauthorized");
    }
  } catch (err) {
    throw err;
  }
};




