
 // Import ExpenseService class from ExpenseService module
const Authservice= require('../Service/Auth_service'); // Import Authservice from Service module

 const Signup = async (req, res)=> {
  try {
    console.log("calling from controller");
    res.status(200).send(await Authservice.Signup(req.body));
  } catch (err) {
    res.status(401).send({ status: "failed to save data", error: err });
  }
};

 const Login = async (req, res)=> {
  try {
    console.log("calling from controller");
    res.status(200).send(await Authservice.login(req.body));
  } catch (err) {
    res.status(401).send({ status: "failed to get data", error: err });
  }
};

module.exports={
  Signup,
  Login
}

