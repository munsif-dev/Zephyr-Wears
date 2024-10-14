const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");
// This is the jsonwebtoken library, used to generate a JWT token for user authentication. Using JWT for authentication and authorization offers a secure, scalable, and efficient way to manage user sessions and data exchange in modern web applications. Its stateless nature and self-contained structure make it particularly advantageous for distributed and microservices architectures.

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    //   bcrypt.compare(password, user.password): This compares the input password (from the login form) with the hashed password stored in the database. It returns true if the passwords match, otherwise false.

    console.log("checkPassoword", checkPassword);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8,
      });
      // his generates a JWT token with the user's data (_id and email), signed using the secret key stored in environment variables
      const tokenOption = {
        httpOnly: true,
        //   Ensures that the cookie is only accessible via HTTP(S) and not JavaScript, which increases security.
        secure: true,
      };

      // Sets the JWT token in a cookie named "token" with the options (httpOnly and secure).
      // status(200): Sends an HTTP 200 status, indicating a successful login.
      // json({...}): Sends a JSON response
      // Persistent Cookies: These cookies remain on the user's device even after the browser is closed. They have an expiration time and are often used for remembering login details or user preferences.
      res.cookie("token", token, tokenOption).status(200).json({
        //method allows you to send a cookie from the server to the client in the HTTP response header.
        message: "Login successfully",
        data: token,
        success: true,
        error: false,
      });
    } else {
      throw new Error("Please check Password");
    }
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignInController;
