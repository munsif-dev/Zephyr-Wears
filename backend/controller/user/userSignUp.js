const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
// bcryptjs library, which is used for hashing passwords securely.

// This function is asynchronous, meaning it can handle promises using await for operations like database queries.
async function userSignUpController(req, res) {
  try {
    const { email, password, name } = req.body;

    const user = await userModel.findOne({ email });

    console.log("user", user);

    if (user) {
      throw new Error("Already user exits.");
      // This checks if a user with the same email already exists in the database.
    }

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }
    if (!name) {
      throw new Error("Please provide name");
    }

    const salt = bcrypt.genSaltSync(10);
    // Generates a salt (random data) with a cost factor of 10. A higher number means more security but also more time to generate the hash.
    const hashPassword = await bcrypt.hashSync(password, salt);
    // Hashes the password using the salt. This makes the password secure by transforming it into a unique, non-reversible value. The await ensures that this process is completed before moving forward.

    if (!hashPassword) {
      throw new Error("Something is wrong");
    }

    const payload = {
      ...req.body,
      role: "GENERAL",
      password: hashPassword,
    };
    //       This is an object containing all the data from req.body (i.e., email, name, etc.), along with:
    // role: "GENERAL": Sets a default role of "GENERAL" for the user.
    // password: hashPassword: Replaces the plain text password with the securely hashed password.

    const userData = new userModel(payload);
    const saveUser = await userData.save();
    // Until now we wrote the logic to save the data of the user from the req.body

    //now we are going to make a res to that request
    res.status(201).json({
      data: saveUser,
      // data: The newly saved user data
      success: true,
      error: false,
      message: "User created Successfully!",
    });
    //   If an error occurs at any point in the try block, it is caught in the catch block.
  } catch (err) {
    res.json({
      message: err.message || err,
      // || operator returns the first "truthy" value it encounters. If the left-hand side is falsy, it will return the right-hand side.
      // (|| err) refers to the whole Error object itself. If for some reason err.message is undefined or doesn't exist, then it will return the entire Error object
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController;
